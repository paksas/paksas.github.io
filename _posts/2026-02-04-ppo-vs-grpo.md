---
title: "PPO vs GRPO"
date: 2026-02-04 12:43:14 +0000
author: Piotr Trochim
categories: [ml, rl]
mathjax: true
original_url: https://piotrtrochim.substack.com/p/ppo-vs-grpo
---

> A Deep Dive into Two Policy Gradient Implementations

This post compares two policy optimization algorithms implemented in our RL codebase: Proximal Policy Optimization (PPO) and Group Relative Policy Optimization (GRPO). We’ll examine their architectural differences, loss functions, and training loops from an engineering perspective.

## Shared Abstractions: The Policy Interface

Both PPO and GRPO optimize a stochastic policy—a neural network that outputs a probability distribution over actions given a state. Despite their algorithmic differences, both algorithms need the same core operations from a policy:

  1. **Sample actions** during environment rollout

  2. **Evaluate action probabilities** during training (for importance sampling)

This shared requirement allows us to define a single `StochasticPolicy` interface that both algorithms consume:
```python
class StochasticPolicy:
    def get_action(states) -> (action, log_prob)
    def evaluate_actions(states, actions) -> (log_probs, entropy)
```

The benefit is that policy architectures become algorithm-agnostic. Whether using a simple MLP, a continuous Gaussian policy, or a LoRA-finetuned LLM backbone, the same network can be trained with either PPO or GRPO without modification.

## The Core Architectural Difference: Value Functions

The fundamental distinction between PPO and GRPO lies in how they estimate the baseline for variance reduction.

  * **PPO** trains a value network alongside the policy. This network learns to predict expected returns from each state, providing a per-timestep baseline for advantage computation.

  * **GRPO** eliminates the value network entirely. Instead, it collects multiple trajectories per update and normalizes rewards _*across the group*_. The baseline is simply the mean reward of the batch—no learned parameters required.

This trade-off is significant - PPO has more model complexity but needs fewer environment samples per update. GRPO has a simpler architecture but requires collecting `group_dim` trajectories before each optimization step.

## Loss Function Comparison

Both algorithms use the clipped surrogate objective from PPO, but differ in advantage computation and regularization.

### The Clipped Objective (Shared)

Both algorithms compute the probability ratio between current and old policies, then clip it to prevent destructive updates:

Where 

is the importance sampling ratio.

### Advantage estimaqtion

PPO uses Generalized Advantage Estimation (GAE)

where

Meanwhile, GRPO uses group-relative normalization (that gives rise to its name):

where

are computed are computed across multiple collected trajectories for the same episode rollout.

### Value loss and regularization

GRPO looses PPO’s value loss term, because it’s not using the value function.

Regularization also differs - the baseline PPO algorithm used an Entropy bonus, and some later extensions migrated to using KL divergence to minimize the changes to policy distributions during a training step. And KL divergence is what GRPO uses.

GRPO paper also introduced a more stable way of approximating KL divergence. 

### Final loss

For PPO, it’s:

while for GRPO it’s:

### Key Insight: Temporal vs. Batch Normalization

The advantage computation is where these algorithms fundamentally diverge:

- **PPO ’s GAE** performs _temporal_ credit assignment—it propagates information backward through time using the learned value function to determine which actions led to good outcomes.

- **GRPO ’s group normalization** performs _batch_ comparison—it asks “how did this trajectory’s reward compare to other trajectories from the same policy?” This sidesteps temporal credit assignment entirely.

## Training Loop Comparison

Because GRPO trains on multiple trajectories for the same initial condition (or, in LLM terms - multiple completions to the same input query), several aspects of the training loop change:

PPO’s tensor shapes for State, Actions, Rewards etc. take form `(T, …)`, where T - trajectory length. GRPO introduces an additional dimension G - group dimension - changing the shape to `(T, G, …)`.

Because of this additional Group dimension, which can be thought of as a Batch dimension, trajectories for GRPO need to be **padded** and **masked**.

Lastly, because GRPO doesn’t use Value function, only the Policy module is trained.

### The Masking Requirement in GRPO

Since GRPO stacks multiple trajectories of different lengths, it must:

  1. Pad shorter trajectories to match the longest

  2. Create a mask tensor indicating valid (non-padded) positions

  3. Apply the mask during:

     1. Advantage normalization (compute mean/std only over valid rewards)

     2. Loss computation (exclude padded timesteps from gradients)

This adds implementation complexity but is unavoidable when batching variable-length sequences.

### Pseudocode Comparison

PPO Training Loop:
```python
for epoch in epochs:
    trajectory = collect_episodes(policy, env)          # Shape: (T, ...)

    advantages = compute_gae(trajectory, value_fn)      # Temporal credit assignment

    loss = ppo_loss(policy, value_fn, trajectory, advantages)

    optimizer.step(loss)                                # Updates policy AND value_fn
```

GRPO Training Loop:
```python
for epoch in epochs:
    trajectories = [collect_episodes(policy, env)
                    for _ in range(group_dim)]          # List of G trajectories

    batched = stack_and_pad(trajectories)               # Shape: (T, G, ...)
    mask = compute_mask(batched)                        # Valid position indicator
    advantages = group_normalize(batched.rewards, mask) # Batch comparison

    loss = grpo_loss(policy, batched, advantages, mask)

    optimizer.step(loss)                                # Updates policy only
```

## When to Use Each Algorithm

The obvious difference is that PPO is a general purpose policy optimization algorithm that can handle both LLM tuning as well as other RL use cases.

In addition, it takes the candle when dealing with limited environment samples - the value function increases sample efficiency and enables learning from fewer trajectories. 

GRPO on the other hand has been designed specifically for LLM tuning. I took a liberty of unleashing it on a regular RL environment, however it’s not suitable to that - it’s much less sample efficient and assumes a strong policy baseline.

## Conclusion

PPO and GRPO share the same clipped surrogate objective but differ fundamentally in how they estimate advantages:

- **PPO** learns a value function for temporal credit assignment, adding model complexity but reducing sample requirements

- **GRPO** uses group-relative normalization, trading sample efficiency for architectural simplicity

The shared policy interface in our implementation means you can benchmark both algorithms with identical network architectures—only the training loop and loss computation differ.

Thank you for reading !
