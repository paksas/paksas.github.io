---
title: "Bayesian Inference"
mathjax: true
author: ptrochim
categories: math
---

# Introduction

This is a post in the series about statistical model fitting.
It's my attempt to explain various approaches and algorithms in a way I would have liked to learn them when I had first started studying this fascinating topic.

In this post, I will be covering a method that builds on top of [Maximum Likelihood Estimate](https://en.wikipedia.org/wiki/Maximum_likelihood_estimation) method I covered in [the previous post](https://paksas.github.io/math/2020/05/15/mle.html), enhancing it.

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

If you recall, MLE allowed to direcly calculate the values of distribution parameters. It meant that it was caclulating a distribution with *complete confidence* in its result. It makes sense, since the method relied exclusively on the data, which is a solid evidence. So unless there was other data available, the method was 100% confident about its estimate.

Right now we want to express our *doubt*, and *doubts* are expressed using... distributions.
That's right - we are going to find another distribution, which we will use to *sample* the values of our *target distribution* parameters.

It took me a very long time to come to that realization during my studies, so I want to repeat that _important_ paragraph again:

> Right now we want to express our *doubt*, and *doubts* are expressed using... distributions.
> That's right - we are going to find another distribution, which we will use to *sample* the values of our *target distribution* parameters.

# Building a model of uncertainty

We have two quantities now:
* the observed coin toss results
* the level of confidence about the parameters

We can express confidence about something with a distribution. Let's denote that distribution $$\xi$$, without defining it really.
Ditributions are properties of Random Variables - and this one is no different. Its Random Variable samples from a set of all possible distribution parameters $$\theta \in \omega$$.

Think about it - we now have a random variable that has some expected value and variance (uncertainty about that value) that represents the parameters $$\theta$$ of our *target distribution*. This is exactly what we wanted.

But what about the data - the toss results?
Well, since we have access to $$\theta$$ values, we could check which ones can even generate the tosses we observed, and how likely would those be.

Then, we could weight those predictions by the probability of actually drawing the specific parameter values $$\theta$$.

Allow me to be loose with the notation and just start putting things together:

$$p(\theta, data) = f(data, \theta) * \xi(\theta)$$

If $$\theta$$ is a specific sample, and so is the $$data$$:
* $$\xi$$ would return the probability of drawing $$\theta$$ from the *parameter distribution*.
* $$f(data, \theta)$$ would return the probability of drawing $$data$$ for the given value of $$\theta$$
* and by that property, $$p(\theta, data)$$ would be the revised *"probability"* of drawing parameter value $$\theta$$ after having observed $$data$$.

There are 3 problems with the equation above:
* it operates on specific values, so it could be good maybe for discrete distributions, but would break as soon as we wanted to use a continuous one.
* it operates on specific values (deuce), so it doesn't really give us the distribution we are looking for
* if $$\xi$$ was a discrete distribution, and we would actually iterate all values of $$\xi$$ and summed the returned probabilites, they wouldn't add up to 1 - so it doesn't actually return a probability distribution.

# Bayes Theorem

At this point I would like to introduce the Bayes Theorem. Actually all of you probably know it, and those who don't can have a quick look at one of the numerous sources that describe it in detail, such as [this Wikipedia page](https://en.wikipedia.org/wiki/Bayes%27_theorem).

$$p(A|B)=\frac{p(B|A) * p(A)}{p(B)}$$

or, more precisely:

$$p(A_j|B)=\frac{p(B|A_j) * p(A_j)}{\sum_{i} p(B|A_i) * p(A_i)}$$

In plain English, our belief about particular parameter values A_j, after we have observed coin toss results B, is the same as the probability of seeing those results being drawn from a distribution parameterized using A_j, and then scaling that value by the likelihood of actually coming across the parameters A_j, as well as that of running into thoe toss results - no matter what parameterization is used.

# Bayes Theorem to fix our model

Our model doesn't look much like the Bayes Theorem:

|Model|Bayes Theorem|
|---|---|
|$$p(\theta, data) = f(data, \theta) * \xi(\theta)$$|$$p(A\|B)=\frac{p(B\|A) * p(A)}{p(B)}$$|

Even if we replace A and B with the same letters, they are still different:

|Model|Bayes Theorem|
|---|---|
|$$p(\theta, data) = f(data, \theta) * \xi(\theta)$$|$$p(\Theta\|Data)=\frac{p(Data\|\Theta) * p(\Theta)}{p(Data)}$$|

* we don't have the denominator $$p(Data)$$.
* Bayes Theorem uses Random Variables (upper case labels), where as our model operates on samples (lower case labels)
* the functions look kind of the same, but the ones in our model are missing the conditional vertical bars



# Conjugate distribution

Explain that in order to be able to use posterior as the next iteration prior, MLE and prior need to be conjugate distributions
Quote Pearse stats book on the conjugate prior
Beta is a conjugate of the binomial distr.

# Posterior

# Algebra to derive the posterior update rule

# Example

Interactive plot showing a few iterations in which we update the initial belief

here's my plot

{% include test.html %}

after the plot
