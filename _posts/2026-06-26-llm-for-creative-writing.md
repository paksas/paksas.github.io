---
title: "LLMs for creative writing"
date: 2026-06-26 12:00:00 +0000
author: Piotr Trochim
categories: [engineering, ml]
mathjax: false
original_url: https://piotrtrochim.substack.com/p/llms-for-creative-writing
---

For those of you who don't know this about me, I consider myself a huge bookworm. I read around 5 novels a month, and I'm not even counting short stories. Space Operas, Sci-fi and ... Romance ;) are my drug of choice.

So I wanted to know what the research actually says about using large language models to write fiction. I went looking - through arXiv, the journals, Reddit and Substack in search for some facts about how authors leverage generative technology to write. What follows is the honest version of that, including the parts where the evidence is thin.

The academic evidence is strong and surprisingly consistent on one thing - LLMs flatten creative output across people. It is also strong on the ethics and copyright fight, because that part is happening in courtrooms and has a paper trail. It is much weaker on what majority of us would consider "low hanging efficiency gains" - helping authors do edits, brainstorm and draft their work. 

![alt text](https://github.com/paksas/paksas.github.io/raw/master/_images/2026-06-26-for-creative-writing/llms_for_creative_writing.png)

## Getting the general sense of volume of LLM use for creative writing

Let's start with the obvious question - which models are actually being used, and how good are they at fiction. We'll check out the proprietary models for one simple reason - they track the data we need.

["How People Use ChatGPT" (NBER WP 34255)](https://www.nber.org/papers/w34255) sheds some light on this, albeit looking only at the OpenAI models. Anthropic's [Economic Index](https://www.anthropic.com/economic-index) updated on 26 Jun, 2026 on the other hand shares data for Claude models. To make sense of the data there we also need the size of global population using the two 

After wrangling the data a bit we can infer the global number of users leveraging the mainstream LLMs for writing fiction.

Model vendor | Fiction share of usage (± est.) | Estimated global user base | Fiction writers as a share of all assistant users, reach-weighted (± est.) | estimated number
-- | -- | -- | -- | --
OpenAI | 2% (~1.5 - 2.6%) | ~1B monthly active | ~1.9% (~1.5 - 2.6%) | about 20M people (15 - 26M)
Anthropic | 6.3% (~4.5 - 8.8%) | ~30M monthly active, consumer only - API and enterprise not counted | ~0.18% (~0.07 - 0.45%) | about 2M people (0.8 - 5M)

That last two columns deserve an explanation. A 6.3% share (for Anthropic) sounds like the bigger number until you remember it sits on a user base around thirty times smaller, so once you weight by reach the ranking flips and OpenAI ends up with roughly ten times as many people writing fiction as Anthropic. 

Look at the number again - that's approx. 22M users who write fiction. To put that in perspective:

| Source | People writing fiction, per month |
|---|---|
| ChatGPT + Claude, fiction (our estimate) | ~22M |
| [Wattpad](https://expandedramblings.com/index.php/wattpad-statistics-facts/), active writers (~10% of users) | ~2.5M |
| [NaNoWriMo](https://en.wikipedia.org/wiki/National_Novel_Writing_Month), peak participation (Nov 2022) | ~400K |
| [Royal Road](https://medium.com/@hrule/royalroad-analysis-2025-86b92fae99d8), original web-fiction authors | ~23K |

The amount of LLM users declaring their main use is for creative writing is 10x larger than the throughput of the repository of amateur novels, and 1000x larger than the professionally published books! Let's hold that thought for a moment.

### The open source models

Open weights are the one place I have to leave a blank. They ship no usage telemetry, and the single large dataset that does exist - OpenRouter's [hundred-trillion-token study](https://openrouter.ai/state-of-ai) - folds creative writing into one "roleplay" bucket alongside games, interactive fiction and adult content, so prose authoring cannot be separated out. 

The tools that would isolate it, the dedicated fiction apps like NovelAI, Sudowrite and Novelcrafter, are all multi-model, so even their user counts cannot tell you how much runs on an open model rather than on Claude or GPT. 
I can't put a number on how many people write fiction with open-source models - the capability is clearly there, but the usage data simply is missing.

## How good are the models at (creative) writing

In 2023 [Confederacy of Models](https://arxiv.org/abs/2310.08433) was published. It evaluated LLMs on a task of Creative Writing (precisely what we're interested in).

The task was for the LLM to generate an end-to-end story given a simple prompt: `Write an epic narration of a single combat between Ignatius J. Reilly and a pterodactyl, in the style of John Kennedy Toole`.
The same prompt was given to a few human participants. It was also humans who scored all stories, and here's how they graded them:


| Model | score (%) |
|---|---|
| GPT-4 | 80.2 |
| Claude 1.2 | 74.4 |
| **Human baseline** | **70.1** |
| GPT-3.5 / ChatGPT | 63.0 |
| Vicuna | 59.0 |
| Bard| | 48.2 |

We're omitting a most of the models tested in the paper to more clearly get the point across - two of the leading at the time LLMs beat humans.

Most recently, [Hemingway-bench](https://surgehq.ai/bloghemingway-bench-ai-writing-leaderboard) revived the attempt to evaluate how LLMs handle creative writing. Published in February 2026, is a `a leaderboard powered by expert human writers who spend hours, not seconds, evaluating frontier models on real writing tasks across the creative, business, and everyday spectrum`.

I encourage you to give their blog a read. We're just going to focus on scores here.

| Model | Elo ranking |
|---|---|
| Gemini 3 Flash | 1111 |
| Gemini 3 Pro | 1101 |
| Claude Opus 4.5 | 1072 |
| GPT 5.2 Chat | 1057 |
| Kimi K2.5 | 1050 |
| GPT 5.2 | 1012 |
| QWEN 3 Max | 1001 |
| Grok 4.1 Fast Reasoning | 986 |
| Llama 4 Maverick Instruct | 885 |


I wound a few other benchmarks published between 2024-2025 - I encourage you to take a look.
- [Creativity Index](https://arxiv.org/abs/2410.04265) (2024)
- [NoveltyBench](https://arxiv.org/html/2504.05228v2) (2025)
- [EQ-Bench Creative Writing](https://eqbench.com/creative_writing.html) (2026)


[WritingBench](https://arxiv.org/html/2503.05244v4) published in 2025 offers a different perspective on writing. It focuses on tasks more mechanical in nature, such as formatting, translation, constraining the results (e.g. make sure the text is around 30 minutes long).
The benchmark leverages an LLM-as-a-judge based evaluator and did not compare the results against humans.

These tasks were much more "mechanical" in nature, and here GPT didn't do as well as Claude. Notice it was also a different GPT (4o - thinking, as opposed to 4 that was tested in Confederacy of Models paper)

| Model | Score (0..10) |
|---|---|
| **Claude 3.7 (thinking)** | **7.91** |
| **Claude 3.7** | **7.85** |
| DeepSeek-R1 | 7.7 |
| Qwen-Max | 7.16 |
| o1-preview | 6.89 |
| **GPT-4o** | **6.81** |
| Qwen-2.5-72B | 6.4 |
| DeepSeek-V3 | 6.35 |
| LongWriter-9B | 6.27 |
| Gemini 1.5 Pro | 6.21 |
| Mistral Large | 6.0 |
| Qwen-2.5-7B | 5.64 |
| Llama-3.3-70B | 5.05 |
| Llama-3.1-8B | 4.42 |
| Suri | 3.2 |

## Direct LLM prompting vs Agentic Harness vs Application

You can get a model to help you write in three ways - prompt it directly in a chat box, drive it through an agentic harness (coding tools like Claude Code, Codex or Gemini CLI, repurposed for prose), or use a purpose-built writing application. Direct prompting is by far the largest and was covered earlier - the ~22M monthly fiction writers are overwhelmingly people typing into ChatGPT and Claude. The two tables below cover the other two.

I found a few popular applications used for creative writing.

| App | Focus | Model(s) behind it | Monthly reach (creative writing) 
|---|---|---|---|
| [Sudowrite](https://sudowrite.com) | Prose-first novel assistant | Own **Muse** fiction model, plus Claude (Sonnet), GPT, Gemini |  ~400K visits/mo |
| [Novelcrafter](https://www.novelcrafter.com) | Configurable workspace with a story "codex" | Bring-your-own-key via OpenRouter - mainly Claude, GPT, Gemini (Grok / DeepSeek for NSFW) | ~453K visits/mo |
| [NovelAI](https://novelai.net) | Story + image generation, minimal filters | Own models (Kayra / Erato) | ~4.3M visits/mo (incl. image gen) |
| [Squibler](https://www.squibler.io) | AI book and screenplay writer | Not publicly disclosed (GPT-class) | ~695K visits/mo (~20K active writers) |
| [Laterpress](https://www.laterpress.com) | Structure-driven fiction editor | GPT (OpenAI) and Claude (Anthropic) only | no data found |
| [ProWritingAid](https://prowritingaid.com) | AI-assisted editing and critique | Undisclosed third-party LLMs | no data found |

As for agentic harnesses, I found [Claude Book](https://github.com/ThomasHoussin/Claude-Book) + [Novel-Writer](https://github.com/forsonny/Claude-Code-Novel-Writer) + [creative-writing-skills](https://github.com/haowjy/creative-writing-skills) with ~450 GitHub stars combined.

## My personal experience

I am in the process of writing 2 books - both fiction novels. In my process, I write the story myself, and use generative AI for smaller tasks : critique, correcting my grammar, styling the language (e.g. write this as if a Gen Z-er would).

I use Claude 4.8 through Claude Code harness with "effort" set to "Harder". Overall - it SUUUUCKS so much.

### Critique
I tried it a few times, gave up - it finds very generic issues with my writing that ALWAYS were done on purpose, to achieve a particular narrative or stylistic effect.

### grammar correction

Hats off - this works VERY well

### Styling

This is effectively otpimization under multiple constraints, and Claude sucks sooo badly at it. First of all, it cannot "deconstruct"/"analyse" the existing stylistic constraints. 
Even when I ask to do it verbatim and then feed the results into it trying to have it check the test using its own metrics - in a fully autoregressive manner - it finds a lot of discrepancies, proving it did a bad job.

Adding style modifications also works like a sieve - some parts of the text will be changed, others won't.

## Discussion

I have on purpose steered clear away from ethical and legal implications of using LLMs for creative writing, trying to focus on the technology. If you would like me to discuss that - please add a comment.

It's clear that LLMs are used in this field, but based on the data and myh personal experience, one thing I can conclude is that the existing models and apps have a long way to go before they can actually be useful in the process of **assisted writing**. 

As for the task of end-to-end writing (**creative writing**), the benchmarks seem to show the models are capable of doing it quite well, better than humans in fact. I would however argue that this work would break short under constraints. Specifically, the benchmarks seemed to use a single prompt and evaluate models' answer to it. But they didn't try sending additional prompts that would modify the existing text - possibly many times on end until the mode collapse.

As always, I invite you to comment and subscribe. Thank you for reading.


## References
- 22M estimate - derived from ["How People Use ChatGPT" (NBER WP 34255)](https://www.nber.org/papers/w34255) and Anthropic's [Economic Index](https://www.anthropic.com/economic-index)
- Wattpad - active-writer share (~10% of users) and monthly writer counts, via [Wattpad statistics](https://expandedramblings.com/index.php/wattpad-statistics-facts/)
- NaNoWriMo - peak participation of ~400K (Nov 2022), via [Wikipedia](https://en.wikipedia.org/wiki/National_Novel_Writing_Month)
- Royal Road - ~23K original-fiction authors, via [RoyalRoad Analysis 2025](https://medium.com/@hrule/royalroad-analysis-2025-86b92fae99d8)
- Open-weights usage - the 100T-token report folds creative writing into a "roleplay" bucket alongside games and adult content, via [OpenRouter State of AI](https://openrouter.ai/state-of-ai)
- Confederacy of Models - 2023 human-scored creative-writing eval where GPT-4 (80.2) and Claude 1.2 (74.4) beat the human baseline (70.1), via [arXiv 2310.08433](https://arxiv.org/abs/2310.08433)
- Hemingway-bench - expert-human-scored writing leaderboard (Feb 2026), via [Surge AI](https://surgehq.ai/bloghemingway-bench-ai-writing-leaderboard)
- Other writing benchmarks (2024-2026) - [Creativity Index](https://arxiv.org/abs/2410.04265), [NoveltyBench](https://arxiv.org/html/2504.05228v2), and [EQ-Bench Creative Writing](https://eqbench.com/creative_writing.html)
- WritingBench - mechanical, constraint-driven writing tasks scored by an LLM-as-a-judge (2025), via [arXiv 2503.05244](https://arxiv.org/html/2503.05244v4)
- Sudowrite - ~$1.8M ARR via [GetLatka](https://getlatka.com/companies/sudowrite.com), and ~400K monthly visits via [Similarweb](https://www.similarweb.com/website/sudowrite.com/)
- Novelcrafter - ~330K monthly visits (Jan 2026) via [Semrush](https://www.semrush.com/website/novelcrafter.com/overview/), and a 2-person team selling into 114 countries via [Paddle case study](https://www.paddle.com/customers/novelcrafter-sells-into-114-countries-with-paddle)
- NovelAI - ~4.3M monthly visits (Apr 2026, incl. image generation), via [Similarweb](https://www.similarweb.com/website/novelai.net/), and 10K+ subscribers / 40K registered (2021), via [CoreWeave case study](https://www.coreweave.com/blog/how-coreweave-helped-novelai-grow-from-0-to-40k-users-in-3-months)
- Squibler - ~695K monthly visits and 20K+ active writers (2026), via [Semrush](https://www.semrush.com/website/squibler.io/overview/)
- App models - Sudowrite prose modes (Muse / Claude / GPT), via [Sudowrite docs](https://docs.sudowrite.com/using-sudowrite/1ow1qkGqof9rtcyGnrWUBS/prose-modes--models/2X5FuivhsbwUiMNym5eUqm). Novelcrafter via [OpenRouter](https://www.novelcrafter.com/help/docs/ai-connections/openrouter) and [NSFW models](https://www.novelcrafter.com/help/docs/models/nsfw-models). Laterpress (OpenAI + Anthropic only), via [Introducing Laterpress AI](https://www.laterpress.com/blog/laterpress-ai/)
- OpenAI Codex - 5M+ weekly users (Jun 2026), ~20% non-developers, via [Codex statistics](https://www.gradually.ai/en/codex-statistics/)
- Claude Code - ~$2.5B annualised run rate, 71% primary-tool share among AI-agent developers, via [Claude Code statistics](https://www.gradually.ai/en/claude-code-statistics/)
- Agentic harness for fiction - open-source frameworks at low-hundreds of GitHub stars combined: [Claude Book](https://github.com/ThomasHoussin/Claude-Book) (94), [Claude-Code-Novel-Writer](https://github.com/forsonny/Claude-Code-Novel-Writer) (71), [creative-writing-skills](https://github.com/haowjy/creative-writing-skills) (286), as of Jun 2026 