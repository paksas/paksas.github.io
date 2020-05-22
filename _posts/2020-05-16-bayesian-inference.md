---
title: "Bayesian Inference"
mathjax: true
author: ptrochim
categories: math
---

## Introduction

This is a post in the series about statistical model fitting.
It's my attempt to explain various approaches and algorithms in a way I would have liked to learn them when I had first started studying this fascinating topic.

[Maximum Likelihood Estimate](https://en.wikipedia.org/wiki/Maximum_likelihood_estimation) method I covered in [the previous post](https://paksas.github.io/math/2020/05/15/mle.html), had its flaws, one of which being its ignorance to hypothesis that may shed light on the collected data. The method I will describe now addresses that very issue.

# Back alley clown

Let me recall the example from the previous post.

> Imagine walking down the street one day, and seeing a small crowd of people surrounding what appears to be a clown flipping a coin.
> He notices you as you approach and waves at you with his other hand. Then, he presents you with a challenge. 
>
> You need to guess if toss coin is fair or not. He will toss the coin 10 times, telling you the result of each toss.
> He will then toss it one more time, and you need to guess the result.

Back then though, all we cared about was the result of those 10 throws. But that's not how humans work. We take circumstance into account.
I would be far more likely to respond to the challenge if I was attending a fair than if I was making a shortcut through a dark, dirty alley.

I'm of course describing the process of *building confidence*.

A fair clown is something rather desired, whereas one encounteres in a back alley would have to first gain our trust. His coin tosses would have to be pretty *convincing*, showing no bias towards one side or another.

# Two distributions

Mathematically speaking, we are still looking for the parameters of a distribution that models the Random Variable that is the clown's coin.

However now in addition to solid evidence, we also have our *prior* beliefs. Those two combined allow us not only to make a guess about the parameter value, but also reflect our level of *confidence* in that guess.

If you recall, MLE direcly calculated the values of distribution parameters - it didn't produce any value that would suggest a doubt about that value. It made sense, since the method relied exclusively on the data, which is a solid evidence. So unless there was other data available, the method was 100% confident about its estimate.

Right now we want to express our *doubt*, and *doubts* are expressed using... distributions.
That's right - we are going to find another distribution, which we will use to *sample* the values of our *target distribution* parameters.

To reiterate:

* MLE -> $$\theta$$
* Bayesian Inference -> $$\theta \sim P(\Theta)$$ ($$\theta$$ sampled from a distribution $$P$$ of the random variable $$\Theta$$)

# Bayesian Inference

As a reminder, the task of any parameter inference is to find parameters $$\theta$$ based on some observed data $$X$$.
In the specific case of Bayesian Inference, $$\theta$$ is estimated indirectly rather than being directly calculated. 

This estimation is achieved by introducing a random variable $$\Theta$$ that models the distribution of the parameter values.
Our task now is to calculate the values of *that* distribution, rather than to directly calculate the values of $$\theta$$, and use that parameter to parameterize the *target distributon* from which the data is sampled:

$$\begin{cases} \theta \sim P(\Theta) \\ x \sim P(X | \Theta=\theta) \end{cases}$$

# Bayes theorem

The method makes use of the famous [Bayes Theorem](https://en.wikipedia.org/wiki/Bayes%27_theorem).
It's quite ubiquitous, and there is a ton of good material out there explaining it in great detail. Therefore I'm going to assume that you're vaguely familiar with it as well as its main use cases.
If I may recommend a book that had the largest impact on my understanding, it would be: []()

Let's quickly recap the theorem and how can it lend itself ot our goal:

$$P(A|B) = \frac{P(B|A)*P(A)}{P(B)}$$

Let's introduce its elements and the terminology:
* $$P(A\|B)$$ is called *the posterior* and expresses our belief about $$A$$ after observing $$B$$.
* $$P(A)$$ is called *the prior* and expresses our belief about $$A$$ before observing $$B$$.
* $$P(B\|A)$$ is called *the likelihood* and expresses the way in which $$B$$ affects our belief about $$A$$.
* $$P(B)$$ is sometimes called *the evidence* and functions as a normalizing factor.

Reading this equation directly isn't very informative. You immediately start asking the following questions:
* if it's $$B$$ that we have observed (the data) and $$A$$ is what we want to estimate, then how do we calculate $$P(B\|A)$$?
* ..in fact, why don't we calculate $$P(A\|B)$$ directly using some distribution equation?
* what is this normalizing factor $$P(B)$$ and how to calculate it?
* what distribution equations to use for all those terms?

I want to focs on building thorough understanding of this before proceeding to the inference problem.

## Notation

# Meaning of random variables A and B

We want to estimate the values of parameters given some observed data, and the left hand side of Bayes theorem is:

$$P(A|B)$$

That would make:
* $$A$$ stand for the random variable that represents the parameters estimation $$\Theta$$
* $$B$$ be the observed data $$X$$

Then we get:

$$P(\Theta|X) = \frac{P(X|\Theta)*P(\Theta)}{P(X)}$$

Let's recal our problem formulation. We are looking for a distribution parameterized by some value of $$\theta$$, from which the data samples (coin tosses) are drawn - $$x \sim P(\theta)$$.
But instead of calculating the value of $$\theta$$ directly, we want to express our belief about its value, so we choose to model it with a random variable $$\Theta$$.
We are then going to use that random variable to parameterize the distribution we draw our data from:

$$\begin{cases} \theta \sim P(\Theta) \\ x \sim P(X | \Theta=\theta) \end{cases}$$

Here, lowercase $$x$$ and $$\theta$$ denote the samples, and their uppercase equivalents $$X$$ and $$\Theta$$ - random variables.
Notice that $$P(X | \Theta)$$ appears in the Bayesian equation, however not on its left hand side. It is in fact the likelihood.

This is very confusing. Are we calculating the wrong value? Should our equation look like this then:

$$P(X | \Theta) = \frac{P(\Theta | X)*P(X)}{P(\Theta)}$$

The answer is NO. We are looking for P(\Theta), but the one that takes into account the observed data $$X$$ - $$P(\Theta | X)$$.
It is that distribution that will express our belief about the parameterization of the data distribution.

But then how do we write down the *target data distribution*? We have several options, all of which definitely need to take $$\Theta$$ into account as well as the random variable $$X$$, which models our data.
We know for sure that it's NOT $$P(\Theta)$$ - that's the distribution of the parameters. So is it:

* $$P(X, \Theta)$$ ?
* $$P(X \| \Theta)$$ ?
* or perhaps $$P(X)$$ with an *invisible* $$\Theta$$ parameterization everyone except for me sort of knows about?

# Distribution function notation

Let's see what different notations mean visually:

|Notation|Visual representation|Comment|
|---|---|---|
|$$P(X)$$|![Fig 1](https://github.com/paksas/paksas.github.io/raw/master/_images/bayes_infr_fig_1.png)|1D probability mass/density function|
|$$P(X=x)$$|![Fig 2](https://github.com/paksas/paksas.github.io/raw/master/_images/bayes_infr_fig_2.png)|1D probability or density value|
|$$P(X, Y)$$|![Fig 3](https://github.com/paksas/paksas.github.io/raw/master/_images/bayes_infr_fig_3.png)|Joint (2D) probability mass/density function)
|$$P(X=x, Y=y)$$|![Fig 4](https://github.com/paksas/paksas.github.io/raw/master/_images/bayes_infr_fig_4.png)|Probability or density value|
|$$P(X, Y=y)$$ and $$P(X \| Y=y)$$|![Fig 5](https://github.com/paksas/paksas.github.io/raw/master/_images/bayes_infr_fig_5.png)|A slice through a 2D function|

Notice how the conditional probability slices through the data. We could as well use the notation $$P(X, Y=y)$$, but the vertical bar notation was adopted for this purpose, and we call this slice "conditional" probability to emphasize that we are fixing the value of one of the variables.

Let's see which type of notation best describe the *target distribution*:

* $$P(X, \Theta)$$ - both the data $$X$$ and the parameters $$\Theta$$ haven't been sampled, and we are talking about a joint function of both
* $$P(X \| \Theta)$$ - we have observed some value of $$\Theta$$ and we want to use it to take a slice from $$P(X, \Theta)$$. We will consider this slice a 1D distribution of $$X$$.
* $$P(\Theta \| X)$$ - we have observed some value of $$X$$ and we want to use it to take a slice from $$P(X, \Theta)$$. We will consider this slice a 1D distribution of $$\Theta$$

It's clearly the 2nd one - $$P(X \| \Theta)$$. It feels like we've gone full circle - the likelihood term of the Bayes Theorem is denoted in the same way as the *target distribution* we will be sampling from.

This confused me for a very long time, and it stemmed from how nuanced the probability notation really is. Let's looks at the equations side by side:

|Bayes Theorem|Model of data generator|
|---|---|
|$$P(\Theta\|X) = \frac{P(X\|\Theta)*P(\Theta)}{P(X)}$$|$$x \sim P(X\|\Theta)$$|

I searched long and hard for an explanation and, to my great disappointment, I didn't find any. But I did find out a few things:
* $$P(X\|\Theta)$$ in both cases can be read as *"conditional distribution of $$X$$ given $$\Theta$$"*
* In Bayes Theorem cast for finding the relationship between conditional distributions, that's also what it is
* in Bayes Theorem cast for the inference problems, that conditional distribution isn't a distribution at all - if you would integrate the area under its curve, that area wouldn't equal 1.0.
* In out model of data generator, it should be read as the conditional distribution, but it's a completely different instance of the distribution.

It seems that the confusion stems from the fact that $$P(X\|\Theta)$$ in the Bayesian Inference equation - the so-called *likelihood* term - isn't a distribution at all. What is it then and why is it using the same notation as a distribution?

# Likelihood function

As we'll see a bit later, the likelihood term is modeled using the equations of actual distribution functions, but it isn't a distribution. The reason is that we are actually plugging in ALL of the values.
It should be written as $$P(X=x|\Theta=\theta)$$ rather than $$P(X|\Theta=\theta)$$, which suggests $$X$$ being a random variable and us modelling some sort of a distribution shape with it.

This function returns 2 different things, depending on the type of distribution function equation used:

|Distribution function type|Likelihood return value|
|---|---|
|discrete|probability|
|continuous|density|

Probability density, because that's the density I'm referring to, isn't equivalent to the probability. But in case of a regular probability density function, should you integrate the area under the entire curve, it would equal to 1.0.

So why is it that in the case of likelihood it wouldn't?

# The parameters of the likelihood function

The answer lies in the function support - another nuance of the notation we usually don't bother to focus on at all.

As I mentioned before, the likelihood term is expressed using a regular distribution function equation. I want to use a concrete example to drive the point here, and since we're talking about coin tosses, I'm going to use the Binomial distribution equation. But please keep in mind that this applies to ANY distribution just the same.

The equation of Binomial distribution probability *mass* function: $$f(k, n, p) = \binom{n}{k} p^{k}(1-p)^{n-k}$$. It's a discrete distribution.
It's discreteness stems from the fact that its support is a subset of integers defined as $$k \in {0..n}$$.

One would use this equation to express a distribution of probability by choosing some value of $$n$$ and $$p$$, and then iterating over all possible values of $$k$$ and running the three through this equation.
Let's say that we want to model the distribution of getting k Heads in 10 tosses, and the tosses are performed with a fair coin (p=0.5).
The equation would then take the form:

$$f(10, k, 0.5) = \binom{10}{k} 0.5^{k}(1-0.5)^{10-k}$$

![Fig 6](https://github.com/paksas/paksas.github.io/raw/master/_images/bayes_infr_fig_6.png)

If you would integrate (sum up in this case) the values, the result would equal 1.0.

But $$k$$ isn't the only parameter we can iterate over. What would happen if we fixed it, and iterated over all possible values of $$p$$ instead?
To be more specific - we have performed 10 tosses, 3 of them were Heads. How does the probability change for different values of $$p$$ ?

$$f(10, 3, p) = \binom{10}{3} p^{3}(1-p)^{10-3} = 120 p^{3}(1-p)^{7}$$

![Fig 7](https://github.com/paksas/paksas.github.io/raw/master/_images/bayes_infr_fig_7.png)

Notice a few things off the bat:
* the plot is no longer choppy.
* it has a different range - (0, 1) rather than {0..10}
* and I can guarantee that if you calculated the integral, it wouldn't add up to 1.

Bayesian Inference writes the likelihood as if it was something that can be modelled as a joint distribution of two variables - the data and the parameterization. Specifically:

$$f(n, k, p) = P(X \| \Theta)$$ where $$X: k$$ and $$\Theta: (n, p)$$.

The only justification I can think of at the time of writing this article is that this is a notation abuse.
As we've seen in the case of Binomial distribution function (and other functions follow suite), there is a very specific support defined and one can't just turn other parameters into random variables and expect to obtain a joint distributon.

In addition to causing confusion, it also introduces mathematical discrepancy - the nominator can no longer be treated as a distribution. So in order to bring the posterior back on track to being a regular distribution, another term needs to step in and act as a normalizer.

# The normalizing role of the evidence term.

Going back to the Bayes Theorem, we find the evidence defined as $$P(X)$$.
The extended version of the Theorem rewrites this term as $$P(X) = \int P(X | \Theta=\theta) d\theta$$:

$$P(\Theta|X) = \frac{P(X|\Theta)*P(\Theta)}{\int P(X | \Theta=\theta) d\theta}$$

It means that we will marginalize random variable $$X$$, which represents the model of our data, for all possible values of $$\Theta$$. That marginalization would guarantee a distribution, if $$P(X\|\Theta)$$ was in fact a distribution, which it isn't.

However - it will normalize the nominator such that the calculated posterior P(\Theta | X) will be a distribution! This does not depend on the type of distribution equations used.
I would however appreciate a proof, so if anyone knows it, please share.

# Can Maximum Likelihood Estimate be used to calculate the Likelihood term?

To close the topic of confusing notation, I wanted to bring up a strange similarity of names between the Maximum Likelihood Estimate and the Likelihood term in the Bayesian Inference.
What confused me in particular was whether MLE *should* be used to calculate the value returned by the likelihood term.

There is no relation between the two:
* As we've learned, the likelihood term returns some value or function, which shouldn't be treated as a probability distribution.
* The Maximum Likelihood Estimate is a method to assess the value of distribution parameter $$\theta$$.

The two return completely different things. In fact, on the conceptual level, MLE produces the same values that sampling from the posterior returned by Bayesian Inference does:

$$\begin{cases} \theta \sim MLE(X) \\ \theta \sim P(\Theta | X) \end{cases}$$

## How does it work

Now that we know how each part of the equation works, I wanted to show how it can be used. 

Allow me to pull some fake data out of the hat and use it to solve our coin tossing problem.
For example - let's say that I've observed the clown tossing 7 Heads in 10 coin tosses.
As a reminder, I now need to call the result of the next toss. In order to do that, I need to estimate the "fairness" of the coin, or our parameter $$p$$ that we have seen used in the Binomial distribution:

$$f(n, k, p) = \binom{n}{k}p^k(1-p)^{n-k}$$

Once I know the value of that parameter, I will be able to determine which side is more likely to show up on the next toss. If the value is closer to 1 - it will be the Heads, if it's closer to 0 - Tails.
The value of 0.5 will put me in a pickle, because it would mean the coin is fair and I would have to guess.

Maximum Likelihood Estimate would suggest the coin is biased towards Heads. However, I have some other information I can incorporate in my assessment.

# Choosing a prior

My first clue is that I encountered the clown while taking a shortcut through a dark back alley. Yes, this isn't a fair, or any other place where you would expect to meet a coin tossing clown.
I suspect that he will try to trick me and he's somehow controlling the coin.

My suspicion is that it's biased towards Tails.

I will use a Beta distribution:

$$P(\Theta) = \frac{\Gamma(\alpha + \beta)}{\Gamma(\alpha)\Gamma(\beta)}\theta^{\alpha - 1}(1-\theta)^{\beta - 1}$$

with parameters $$alpha=1$$ and $$beta=3$$ as a prior, which I think best reflects that belief:

$$P(\Theta) = \frac{\Gamma(4)}{\Gamma(1)\Gamma(3)}\theta^{0}(1-\theta)^{2} = 3 (1-\theta)^{2}$$

![Fig 8](https://github.com/paksas/paksas.github.io/raw/master/_images/bayes_infr_fig_8.png)

# Choosing the likelihood function

The likelihood function needs to appraise the collected data and return a *metric* (not a probability, but a metric), how likely that data was given the hypothesized parameter values.
The choice of the function is arbitrary, and often dictated by a similarity to a particular distribution model.

That is also why I chose to use the Binomial Distribution function with fixed parameters $$(n, k)$$ as the likelihood function:

$$P(X\|\Theta) = \binom{10}{7}\theta^{7}(1-\theta)^3=120[\theta^{7}(1-\theta)^3]$$

![Fig 9](https://github.com/paksas/paksas.github.io/raw/master/_images/bayes_infr_fig_9.png)

# Calculating the evidence denominator

Let's start with the integral version of the Bayes Theorem denominator. $$\theta$$ here has support in range (0, 1), which we will use as the integration limits.

$$P(X) = \int_{0}^{1} P(X\|\Theta) * P(\Theta) d\theta $$

Substitute the functions:

$$P(X) = \int_{0}^{1} [3(1-\theta)^{2}] [120[\theta^{7}(1-\theta)^3]] d\theta $$

Extract the constants and combine the variables, and then use Wolfram Alpha to calculate the final result:

$$P(X) = 360 \int_{0}^{1} \theta^{7}(1-\theta)^{5} d\theta = \frac{5}{143}$$

Notice that this result is a constant. That's the normalizing constant I was referring to.

# Put it all together

We can now substitute those equations into the Bayes Theorem equation:

$$P(\Theta \| X) = \frac{P(X|\Theta)P(\Theta)}{P(X)} = \frac{[120[\theta^{7}(1-\theta)^3]][3 (1-\theta)^{2}]}{\frac{5}{143}}$$

After combining the terms, we get:

$$P(\Theta \| X) = 10296 \theta^{7}(1-\theta)^5$$

![Fig 10](https://github.com/paksas/paksas.github.io/raw/master/_images/bayes_infr_fig_10.png)

And just to verify that it actually represents a probability distribution, its integral in $$\theta$$ support equals 1:

$$\int_{0}^{1} 10296 \theta^{7}(1-\theta)^5 = 1$$

# Conjugate priors

Explain that in order to be able to use posterior as the next iteration prior, MLE and prior need to be conjugate distributions
Quote Pearse stats book on the conjugate prior
Beta is a conjugate of the binomial distr.

