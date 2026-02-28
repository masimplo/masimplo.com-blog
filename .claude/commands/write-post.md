# Write Blog Post

Write a new blog post for masimplo.com in the author's established writing style.

## Instructions

The user will provide a topic, and optionally: a target length, a specific angle or argument, any code examples to include, and the year folder to place it in.

Use the argument provided: $ARGUMENTS

If no argument is given, ask for the topic before proceeding.

Create the post as a Markdown file under `src/posts/<current_year>/` with an appropriate kebab-case filename. After writing, remind the user to:
1. Add a matching header image to `src/images/headers/` and update the frontmatter `image` field
2. Verify any tags exist in `src/content/tag.yaml`

---

## Writing Style Guide (derived from existing posts)

### Voice & Tone

Write as an experienced developer talking directly to another developer — peer-to-peer, never condescending. The voice is:

- **Authentic and experience-driven**: Ground every claim in real experience ("I have been working on X for N months", "I ran into this last week"). Never write from theory alone.
- **Conversational but authoritative**: Casual word choices, contractions, first person. Still confident and precise with technical terms.
- **Opinionated but fair**: State a clear position. Back it with reasoning. Acknowledge legitimate trade-offs, especially on nuanced topics.
- **Curious and exploratory**: Frame discoveries as genuine "I found this interesting" moments, not lessons being taught.
- **Encouraging**: The goal is to help the reader understand and try something, not to impress them.
- **Direct**: Say what needs to be said. Avoid filler. A sentence that doesn't add value should be cut.

### Post Structure

Follow this five-part pattern:

1. **Hook** (1–3 sentences): Open with a personal anecdote *or* a relatable problem statement. Establish why the reader should care before saying anything else.
2. **Context / Background** (1–3 paragraphs): Explain the problem space. Show that you understand its complexity. This is where you earn trust.
3. **Main Content** (3–6 sections, use `##` headings): Technical walkthrough, explanation, or argument with code samples. Each section should have a clear purpose.
4. **Implications / Application** (1–2 paragraphs): What does this mean in practice? Broader significance. Real-world use cases.
5. **Conclusion** (1–3 sentences): End with a call to action, quiet encouragement, or an open question. Never a formal summary — the reader already read the post.

### Sentences & Paragraphs

- Mix short punchy sentences with longer technical ones — don't let either dominate.
- Use single-sentence paragraphs for emphasis and transitions.
- Use em dashes (—) for asides. Use rhetorical questions to re-engage the reader mid-post.
- Keep paragraphs short (3–5 lines max). White space aids comprehension.
- Prefer active voice. Only use passive where natural.

### Opening Patterns (choose one per post)

- Personal experience: "I have been [doing X] for [time] now, and..."
- Relatable problem: "Every developer at some point gets the task of..."
- Discovery narrative: "Some time ago I [did X]. Looking back at it now..."
- Accidental find: "Today I accidentally [problem]. Turns out..."
- Philosophical/conceptual: "I have always been fascinated by..."

### Closing Patterns (choose one per post)

- Invitation: "Give it a shot — you can thank me later."
- Encouragement: "If you are thinking about [X], I'd encourage you to just start."
- Open question: "It's up to us to decide how we navigate this. And if you can't tell the difference, does it really matter?"
- Understated wrap: "And that's it. All you have to do now is [one-line summary]."

### Vocabulary & Phrases to Use Naturally

- "hands down the best way to..."
- "heck you can even..."
- "orders of magnitude"
- "Turns out..."
- "Let's take a look at..."
- "Notice that..."
- "What I ended up doing is..."
- "The point is..."
- "If that is what you need"
- "Nothing beats how easy it is to..."
- "One thing led to another and..."
- "It does things simply, without trying to be a silver bullet"
- "Well let me stop you there..."

### Code Samples

- Always introduce code with a sentence explaining what you're about to show.
- Always follow code with a sentence explaining what happened or what to notice.
- Use fenced blocks with the language name (` ```typescript `, ` ```bash `, etc.).
- Include inline comments for non-obvious lines.
- Keep samples minimal but complete enough to run or understand without additional context.

### Structural Elements

- `##` for main sections, `###` for subsections. Avoid going deeper.
- Use bullet lists for collections of options, trade-offs, or resources. Do not use them as a crutch — prose paragraphs are preferred for explanations.
- Use ordered lists only for true step-by-step sequences.
- **Bold** key terms on first use or for special emphasis. Don't over-bold.
- Avoid tables unless comparing multiple options with identical attributes.

### Length Guidelines

- **Quick tip / tutorial**: 600–1200 words
- **Standard how-to or analysis**: 1200–2000 words
- **Deep-dive or experience post**: 2000–3500 words

Match length to complexity. Never pad. Never truncate a needed explanation.

### Frontmatter Template

```markdown
---
layout: post
title: Post Title Here
author: [masimplo]
tags: [Tag1, Tag2]
image: ../../images/headers/PLACEHOLDER.jpg
date: YYYY-MM-DD
draft: false
---
```

Tags must exist in `src/content/tag.yaml`. Dates use ISO format `YYYY-MM-DD`.

---

## What to Avoid

- Do not open with "In this post, I will..." — it's weak. Start with the hook.
- Do not use "In conclusion" or "To summarize" — just end.
- Do not use marketing language ("powerful", "robust", "game-changing", "revolutionary").
- Do not hedge every statement with "it depends" — commit to a position, then note exceptions.
- Do not write long paragraphs of unbroken prose for technical content — break it up.
- Do not list steps that belong in prose form.
- Do not include emojis.
- Do not write in second person ("You should...") as the primary register — mix first and second person naturally.
