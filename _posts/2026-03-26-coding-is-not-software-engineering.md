---
title: "Coding is not Software Engineering"
date: 2026-03-26 10:20:56 +0000
author: Piotr Trochim
categories: [engineering]
mathjax: true
original_url: https://piotrtrochim.substack.com/p/coding-is-not-software-engineering
---

This topic has been on my mind for many years now. 

The software industry has been inventing novel “Engineering” titles, but it really seems to be peaking now, with “Research Engineers”, “ML Engineer”, “Data Engineers” etc. On the other hand, we start seeing the proliferation of “Scientist” titles, surrounded with similar adjectives.

But when you meet and work with those folks - at FAANG or in the startups - what strikes you is their utter unfamiliarity with software engineering. At best they can be considered Hackers, and not the kind that breaks into system, but rather the kind that slaps two pieces of code together hoping it will do what they want.

The rise of generative AI and its applications to coding makes things even more confusing. I interview candidates who don’t even know how to code - folks I refer to as Wannabes.

## Recruitment

It becomes one when it affects the social contract. I’m actively recruiting to my teams, and I’m spending a significant chunk of my time interviewing. I look for Engineers, but the recruiters keep either sending me Hackers or Wannabes. 

The reason? All of them have extensive resumes plastered with Engineering titles.

The situation is so ridiculous, that one can’t really trust resumes any more and has to spend a lot of time figuring out people’s expertise.

## Incentives

The other element that adds to confusion are the adjectives appended to the title “Engineer”, and their reflection of current industry trends.

These days, no one wants a “Software Engineering” role. But replace the word “Software” with “ML”, and applicants will swarm to it.

If you ask them about the difference, they will start describing their ambitions to work with AI and their fears for being rendered obsolete on the job market.

But not a single applicant focuses on the “Engineering” aspect of that job, and what it entails in both cases.

## Coding is not Software Engineering

So what is the difference, really ?

Engineering is the process of building machines that don’t break. An engineer knows their creation through and through - understands the mechanisms that underlie it thoroughly, knows their operating specifications and safety margins. They have the skills and tools required to modify and repair those mechanism without sacrificing the complete understanding of the creation.

The term “complexity management” is often used to describe what engineers spend a significant portion of time doing. When a need to extend a mechanism arises, the engineer spends a lot of time rethiking the existing one in order to best accomodate the new mechanism and to comprehensively chart the new operating regime.

In software, these translate to refactoring and testing.

Coding on the other hand is just a tool an engineer has under their belt - and it’s one that is used at the lowest level of abstraction.

Engineers operate at 3 layers of abstraction:

  * the lowest one is writing code. This amounts to writing very small bricks the larger mechanism will be composed of.

  * above it sits the mechanism design - the skill of composing virtual machines that operate in a loop, and guaranteeing the stability of that loop - that the loop will not stop, break or go out of whack. In order to construct that, the engineer measures how bricks “sit together” and how the larger construct works and what might make it break. Testing is the main tool used at this level.

  * the highest level of abstaction is thinking about creation - planning how smaller mechanisms (aka. components) will come together to fulfil user requirements. The main tool here is refactoring that supports “complexity management”.

Given this ontology, we can now define the other terminology:

  * Coding - at skill employed at the lowest level of engineering abstraction

  * Hackers - folks operating only at the lowest level of abstraction - slapping pieces of code together and hoping for the best, without employing any heuristic that guarantees directionality of their efforts

  * Wannabes - folks who rely on external tools (such as Gen AI) to do the lowest rung work for them - they operate completely outside this framework.

## Hussle culture and the rise of “fake it till you make it”

Corporate values such as “Move fast and break things” and the culture that prioritizes shipping code over understanding what is being built gave rise to this very confusing landscape.

I feel surrounded by people who keep slapping on titles and cheating their way through careers. 

Meanwhile, the years meticulously spent on honing the craft of Software Engineering seem to be impairing my ability to grow my career. I keep encountering a very strange response to my skills - folks are afraid I will “slow the company down”, because “I want to write tests”, all the while they keep scoring me using “Engineering Excellence metrics”. 

Now that I’m an enterpreneur, I’m making sure not to let such confusing cultural artifacts take root in my companies - but I still pitty good engineers who suffer elsewhere, trying to make sense of these very confusing rules. 

And I fear for the future in which Software Engineering will disappear in all, but its name. I fear it, because if the same trend took place in construction of aviation - I would start fearing for my life.
