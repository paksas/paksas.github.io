---
title: "LLM as a Judge is not a Unit Test"
date: 2026-06-20 12:00:00 +0000
author: Piotr Trochim
categories: [engineering, ml]
mathjax: false
original_url: https://piotrtrochim.substack.com/p/llm-as-a-judge-is-not-a-unit-test
---


LLM as a judge has gained a lot of popularity lately, and for good reason - it lets us measure things we previously could not measure at all. But popularity has a way of flattening nuance, and the method is now routinely used in a way it was never meant to be used. Most of the time I see it deployed as a black box assert call - a single, stochastic verdict standing in for a deterministic test, gating a build, deciding pass or fail.

That specific use is where it falls apart. Not because the tool is bad, but because it is being asked to do the one job it is structurally incapable of doing - behaving like a unit test. In this post I want to separate the method from its misuse, walk through the failure modes that follow when the two get confused, and then give the method its due, because there are things only an LLM judge can measure.

![alt text](https://github.com/paksas/paksas.github.io/raw/master/_images/2026-06-20-llm-as-a-judge/judge.jpeg)

## LLM as a judge 101

The idea is simple. You take a language model and you ask it to evaluate the output of another language model - or of an entire system built around one. Instead of comparing the output to a fixed reference string, you hand the judge a rubric in plain language ("is this response helpful, harmless and on-topic?") and let it return a score, a ranking, or a verdict.

The method comes in a few flavours, and it is worth naming them because they are not equally reliable:

  * **Single-answer grading** - the judge looks at one response and assigns it a score against a rubric. This is the variant most people reach for, and the one most prone to trouble.

  * **Pairwise comparison** - the judge sees two responses and picks the better one. This is what powers leaderboards like [Chatbot Arena and MT-Bench](https://arxiv.org/abs/2306.05685), and it tends to be more stable than absolute scoring because relative judgments are easier than calibrated ones.

  * **Reference-guided grading** - the judge is given a gold answer to anchor its judgment. Unsurprisingly, anchoring helps a lot.

  * **Panel of judges** (sometimes called a jury) - instead of trusting one model, you poll several and pool their votes. [Verga et al.](https://arxiv.org/abs/2404.18796) showed a panel of three smaller, unrelated models can beat a single large judge, with less bias and at a fraction of the cost.

  * **Chain-of-thought scoring**, of which [G-Eval](https://arxiv.org/abs/2303.16634) is the canonical example - the judge is made to reason through explicit evaluation steps before committing to a score.

What is it actually used for? If you read the literature, the centre of gravity is evaluation and benchmarking of models, with two other heavyweight uses sitting alongside it - generating reward signal for training (this is what [Constitutional AI](https://arxiv.org/abs/2212.08073) and [Reinforcement Learning from AI Feedback](https://arxiv.org/abs/2309.00267) do, replacing the human labeller with a model) and curating training data.

But that is the researcher's view. Among the application engineers I actually work with, the dominant use is something narrower and more familiar - regression testing. The eval frameworks lean into this framing directly. LangSmith, for one, lists ["unit tests" as one of its offline evaluation types](https://docs.langchain.com/langsmith/evaluation-types) and notes they are "suitable for CI pipelines." That framing - eval as unit test, wired into the build - is exactly where the trouble starts, so it is worth being precise about what a test even is.

## Testing 101

### Testing a deterministic mechanism

Code is deterministic when, given the same input, it produces the same output.

Deterministic code can be tested using the traditional methods - one writes unit tests covering various input cases and checking how the code processes them. The coverage of those cases is subject to an analysis of the input domain the code operates on, and most generally focuses on corner cases.

Finding those corner cases derives directly from the construction of the code. If we have a function that divides by one of its arguments, we can reason that passing a zero into it will cause a DivideByZero exception, and so we can write a test against exactly that. The test is meaningful because the relationship between input and output is fixed. The assert is allowed to be exact because reality is exact.

### Testing a stochastic mechanism

If the code runs non-deterministically, then given the same input it produces different output. The simplest example is code that uses a random number generator. Another example, the one this post is about, is a generative model.

Code like that can no longer be tested with the traditional approach. It needs to be tested with a statistical test - the engineer subjects the code to a carefully constructed set of inputs, observes the outputs, and measures their statistics. The test is no longer a test in the unit-test sense. It is an experiment, and like any experiment it has to be designed.

Experiment design means selecting the test dataset, its size and its composition, so that the test has enough power to detect the effect you care about and a fair chance of producing an unbiased answer. It means defining the metrics up front, choosing a baseline to compare against, and deciding ahead of time what a statistically significant result looks like. None of this is exotic - it is the ordinary discipline of [adding error bars to evals](https://arxiv.org/abs/2411.00640), of [knowing whether your test set is even large enough](https://aclanthology.org/2020.emnlp-main.745/) to support the claim you want to make, of [significance testing](https://aclanthology.org/P18-1128/) that NLP has been quietly ignoring for years.

Here is the crux of this whole post. An LLM judge does not change the kind of thing you are testing. You are still testing a stochastic mechanism, so you still owe it an experiment. What the judge changes is that your measuring instrument is now itself a stochastic mechanism. And when people wire that instrument straight into an assert, they quietly drop the experiment and pretend they are back in the deterministic world. They are not.

## Testing "smells"

The term I want to borrow here is the "code smell". It was coined by Kent Beck while he was helping Martin Fowler with the Refactoring book, and Fowler [defines it](https://martinfowler.com/bliki/CodeSmell.html) as "a surface indication that usually corresponds to a deeper problem in the system". The important part is that a smell is not a bug. The code compiles, the test passes, nothing is obviously broken. A smell is just a quick-to-spot sign that something underneath deserves a closer look, "an indicator of a problem rather than the problem" itself, as Fowler puts it.

What follows are testing smells in exactly that spirit. Each one looks fine on the surface, and most of them go green in CI, which is precisely what makes them dangerous. They are the surface signs that the experiment underneath was quietly skipped.

### The black box assert

The most common misuse reads something like this:

```python
def test_my_secret_prompt():
    response = llm.complete(
        "Generate a description of a house. Make sure it's positive and wholesome"
    )
    llm_as_judge.assertEqual(response, "This response is positive and wholesome")
```

This looks like a unit test. It is shaped like one, it lives in the test suite like one, and it gates the build like one. But it is not one. Two stochastic systems are stacked on top of each other - the system under test and the instrument measuring it - and the result of a single sample from that stack is being treated as a deterministic fact.

The honest version of this code runs the prompt many times, scores the distribution of outputs, and compares that distribution against a baseline with a threshold you derived from data. The dishonest version runs it once and calls `assertEqual`. The dishonest version is the one I keep finding in production.

I want to be careful here, because there is a real counter-argument. Practitioners I respect, like Hamel Husain, argue that the judge should return a plain binary pass or fail rather than a fuzzy one-to-five score, and they are right. So my objection is not to binary verdicts. My objection is to a single, uncalibrated, stochastic verdict used as a hard gate. The binary judgment is fine. Trusting one sample of it is not.

### The instrument is stochastic too

The first thing people say in defence of the assert is "I set temperature to zero, so it is deterministic now." It is not.

[Work out of Thinking Machines Lab](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/) showed that a thousand completions of the same prompt at temperature zero produced eighty distinct outputs, because the numerics of inference depend on server batch size, which depends on load you do not control. The judge inherits all of this. ["Rating Roulette"](https://arxiv.org/abs/2510.27106) measured how stable judges actually are across re-runs and found intra-rater agreement as low as 0.27 - meaning the same judge, shown the same answer three times, disagrees with itself often enough to matter.

So the judge adds noise on top of the system you are trying to measure. I used to call this error accumulation, but that is the wrong word and it overstates the case - if the two sources of noise are independent, the judge's variance simply adds to the system's variance, it does not compound multiplicatively. Additive is still bad. It means your instrument has its own error bars, and a single reading tells you very little. The fix is the boring one - sample, aggregate, and report a confidence interval. Temperature near zero genuinely helps, and so does a panel, but neither buys you the right to trust one reading.

### The hidden confounder - the judge's training set

This is the failure mode I find most overlooked, most misunderstood, and the one with the cleanest evidence behind it.

An LLM judge is some LLM, and that LLM was trained on some dataset, with some fine-tuning, by some lab with some preferences. Two models fine-tuned on different data will return different verdicts on the same output. That means the choice of judge is a free variable sitting inside your experiment, uncontrolled, silently shaping your results.

It is not a hypothetical. [JuStRank](https://arxiv.org/abs/2412.09569) showed that swapping the judge can move a system up or down a leaderboard by as much as eleven positions. [Preference leakage](https://arxiv.org/abs/2502.01534) showed that judges systematically favour models that share their lineage - a judge prefers its own family - and that this bias is harder to detect than the more famous ones. The mechanism turns out to be [perplexity](https://arxiv.org/abs/2410.21819) - judges over-reward text that looks familiar, text with low perplexity under their own distribution, regardless of whether it is actually better.

Read that again, because it is the heart of the matter. The instrument prefers outputs that resemble its own training data. If you build a system and test it with a judge from the same family, you are not measuring quality, you are measuring resemblance. This is a textbook confounder, and the discipline that controls for it - pick a judge from a different family, use a diverse panel, randomise position, calibrate against human labels - is exactly the experiment design that the black box assert lets you skip.

### Style over substance

The confounder above is about the judge preferring outputs that resemble its own training. There is a related and arguably worse problem - the judge often optimises for how an answer sounds rather than whether it is right.

This is the most damning finding in the whole literature, because it attacks validity directly. [Feuer et al.](https://arxiv.org/abs/2409.15268) (ICLR 2025) found that LLM-judge preferences do not correlate with concrete measures of safety, world knowledge or instruction-following. Earlier work pointed the same way, with judges rating fluent-but-wrong answers above terse-but-correct ones. And the surface features that sway a verdict are almost comically shallow - in one study, [formatting alone](https://arxiv.org/abs/2409.11704) swung a strong judge's preference between seventy-five and eighty-eight per cent of the time, with the underlying content held identical, just by adding bold text, bullet lists, or emoji. The G-Eval authors found their own judge consistently scored machine-written summaries above human-written ones, even on examples where humans preferred the human text.

Sit with what that means. A high agreement number can mean the judge agrees with humans about which answer is prettier, while telling you nothing about which answer is true. If you wire that into a gate, you are not testing correctness, you are training your system to write in the judge's preferred style. The metric becomes the target, and the target is the wrong thing.

### Small model judging a larger model

There is a tempting shortcut - use a small, cheap model to judge the output of a large, expensive one. The intuition that this is dangerous is half right, and worth getting exactly right.

[Qiu, Carroll and Allen](https://arxiv.org/abs/2601.20299) (ICLR 2026) showed that naive LLM-as-a-judge does collapse in this regime - it drops below random guessing when the model being judged is five to twenty times the size of the judge, especially when that larger model is being deceptive. So the worry is real for the naive method.

But I have to be honest about what that paper actually argues, because its title is "Truthfulness Despite Weak Supervision" and the "despite" is the whole point. The authors show that with a better mechanism - peer prediction borrowed from game theory rather than a naive judge - a tiny model can reliably evaluate and even train a far larger one, across size gaps of more than a hundred to one. Their headline is that weak supervision can work, not that it is doomed. So the lesson is narrower than "small judges are useless." The lesson is that a naive judge is the wrong instrument for this job, and the failure is one of method, not of fundamental limits.

### Teaching engineers bad habits

The deepest cost in my opinion is cultural. For complete transparency, this is my opinion and it's not supported by any existing research, only by my personal observations.

LLM as a judge is easy to use. You can stand up a test in minutes. And testing is the most tedious part of software engineering, the part people most want to skip. Tests are too often written as an afterthought rather than up front, even though writing them up front - Test Driven Development - is one of the few practices that reliably produces good code. TDD is, in spirit, experiment design for ordinary software. You state a hypothesis about how the code should behave before you write it, and the test becomes living documentation of that hypothesis.

The black box assert lets you place a shortcut where that discipline used to go. It lets you "just have some tests" without thinking about input domains, without baselines, without asking what good even looks like. It feels like rigour and it costs nothing, which is the most dangerous combination there is.

I should engage the strongest objection to this, because it is a good one. Some argue that TDD genuinely does not fit generative systems - there is no single knowable correct output to assert against, so evals are the correct adaptation rather than an escape from discipline. I agree with the premise and reject the conclusion. The absence of a fixed correct answer does not abolish the discipline, it relocates it. It moves from "assert the answer" to "design the experiment." The engineers I worry about are not the ones who replaced TDD with rigorous evals. They are the ones who replaced TDD with a single assert and called it done.

## Three years of watching this happen

Here I owe you full honesty, because I went looking for evidence and there is essentially none. No study I could find measures the bug rate or maintainability of a codebase as a function of how heavily it leans on LLM judges. So what follows is my anecdote, not a finding.

In the codebases I have worked in over the last three years, the ones that adopted LLM-as-a-judge testing early and uncritically are the ones that are hardest to maintain. The tests are flaky, so people learn to ignore failures, or worse - have another LLM rewrite them from scratch when the code drifts, so that they turn green again. I saw the judge prompts drift as the underlying models are deprecated and silently updated, so the suite rots. After a very short while, the suite stops being documentation and becomes noise.

The closest thing to a theoretical anchor for this is the old [Hidden Technical Debt in Machine Learning Systems](https://proceedings.neurips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html) paper, and its CACE principle - Changing Anything Changes Everything. A stochastic component wired into a place that used to hold a deterministic oracle is debt of exactly this kind. I believe my experience generalises because the mechanism is sound, but I want you to weigh it as experience, not proof.

## The good

I have spent this whole post on the misuse, so let me be clear about the use, because it is real and I rely on it.

There are things you simply cannot test any other way. How do you write a deterministic assert for "is this summary faithful to the source"? For "is this multi-turn conversation coherent"? For "did this agent take a reasonable path to the answer"? You cannot. There is no reference string. For these, a flexible, adaptive judge is not a shortcut, it is the only instrument available - which is why faithfulness evaluation for retrieval systems has standardised on exactly this approach, with frameworks like [RAGAS](https://arxiv.org/abs/2309.15217) and [ARES](https://arxiv.org/abs/2311.09476) decomposing answers into claims and verifying them, the latter calibrating its estimates against a few hundred human labels so the numbers come with confidence intervals.

That last detail is the whole game. The method works when you observe the discipline it demands. Use a rubric. Swap answer positions to cancel order bias. Pick the strongest judge you can afford, and pick it from a different family than the system under test. Calibrate it against human labels before you trust it, the way you would calibrate any instrument. Sample, aggregate, and report error bars. Treat the result as a measurement with uncertainty, not as a verdict carved in stone.

Do all of that and LLM as a judge becomes what it should have been all along - not a black box assert smuggled into your unit tests, but a measuring instrument in a properly designed experiment. The method was never the problem. Pretending it was a unit test was.

## References

  * Zheng et al. (2023), "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena" - [arxiv.org/abs/2306.05685](https://arxiv.org/abs/2306.05685)

  * Verga et al. (2024), "Replacing Judges with Juries: Evaluating LLM Generations with a Panel of Diverse Models" - [arxiv.org/abs/2404.18796](https://arxiv.org/abs/2404.18796)

  * Liu et al. (2023), "G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment" - [arxiv.org/abs/2303.16634](https://arxiv.org/abs/2303.16634)

  * Bai et al. (2022), "Constitutional AI: Harmlessness from AI Feedback" - [arxiv.org/abs/2212.08073](https://arxiv.org/abs/2212.08073)

  * Lee et al. (2023), "RLAIF: Scaling Reinforcement Learning from Human Feedback with AI Feedback" - [arxiv.org/abs/2309.00267](https://arxiv.org/abs/2309.00267)

  * Miller (2024), "Adding Error Bars to Evals" (Anthropic) - [arxiv.org/abs/2411.00640](https://arxiv.org/abs/2411.00640)

  * Card et al. (2020), "With Little Power Comes Great Responsibility" - [aclanthology.org/2020.emnlp-main.745](https://aclanthology.org/2020.emnlp-main.745/)

  * Dror et al. (2018), "The Hitchhiker's Guide to Testing Statistical Significance in NLP" - [aclanthology.org/P18-1128](https://aclanthology.org/P18-1128/)

  * He et al. (2025), "Defeating Nondeterminism in LLM Inference" (Thinking Machines Lab) - [thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/)

  * Haldar & Hockenmaier (2025), "Rating Roulette: Self-Inconsistency in LLM-As-A-Judge Frameworks" - [arxiv.org/abs/2510.27106](https://arxiv.org/abs/2510.27106)

  * Gera et al. (2024), "JuStRank: Benchmarking LLM Judges for System Ranking" - [arxiv.org/abs/2412.09569](https://arxiv.org/abs/2412.09569)

  * Li et al. (2025), "Preference Leakage: A Contamination Problem in LLM-as-a-Judge" - [arxiv.org/abs/2502.01534](https://arxiv.org/abs/2502.01534)

  * Wataoka et al. (2024), "Self-Preference Bias in LLM-as-a-Judge" - [arxiv.org/abs/2410.21819](https://arxiv.org/abs/2410.21819)

  * Feuer et al. (2025), "Style Outweighs Substance: Failure Modes of LLM Judges in Alignment Benchmarking" - [arxiv.org/abs/2409.15268](https://arxiv.org/abs/2409.15268)

  * Zhang et al. (2024), "From Lists to Emojis: How Format Bias Affects Model Alignment" - [arxiv.org/abs/2409.11704](https://arxiv.org/abs/2409.11704)

  * Qiu, Carroll & Allen (2026), "Truthfulness Despite Weak Supervision: Evaluating and Training LLMs Using Peer Prediction" - [arxiv.org/abs/2601.20299](https://arxiv.org/abs/2601.20299)

  * Sculley et al. (2015), "Hidden Technical Debt in Machine Learning Systems" - [proceedings.neurips.cc](https://proceedings.neurips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html)

  * Es et al. (2023), "RAGAS: Automated Evaluation of Retrieval Augmented Generation" - [arxiv.org/abs/2309.15217](https://arxiv.org/abs/2309.15217)

  * Saad-Falcon et al. (2023), "ARES: An Automated Evaluation Framework for Retrieval-Augmented Generation Systems" - [arxiv.org/abs/2311.09476](https://arxiv.org/abs/2311.09476)
