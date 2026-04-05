# Clover Blog — Writing Style Guide

This doc is the reference for anyone writing or prompting AI to write articles for the Clover blog. Every article should feel like it was written by a parent who actually uses the app, not by a content team.

---

## Voice and tone

Write like you're texting a friend who just had a baby. Warm, practical, occasionally wry. You've been there, you know how stressful it is to be out with a baby and not know where to go.

- Use "you" and "your baby" — talk directly to the reader
- First person is fine when sharing an experience ("in my experience", "I've never had a problem")
- Don't be overly positive or salesy. If somewhere is hit or miss, say so
- A bit of dry humour is good. Don't force it though

---

## What to avoid

- **No em dashes** — use a comma or a full stop instead
- **No bullet lists for main content** — use prose. Lists are fine for quick comparisons only
- **No AI-ish phrases**: "it's worth noting", "it's important to", "dive into", "let's explore", "game-changer", "seamlessly"
- **No overly structured headers** like "Introduction" or "Conclusion"
- **Don't pad the word count** — if you've said what you need to say, stop

---

## Structure

Articles should feel like a blog post, not a Wikipedia article or a content marketing piece.

**Opening paragraph**: Get into it straight away. No "In today's guide, we'll be looking at..." Just start with the thing. One punchy paragraph that sets up why you're writing this.

**Body sections**: Use H2 headings to break up the page, but keep them conversational. Think "The tube is basically useless for changing" not "Public Transport Facilities". Each section is 2-4 short paragraphs.

**Paragraphs**: Max 3 sentences. Usually 2. If a sentence is long, make the next one short.

**Ending**: Don't summarise. End with a soft mention of Clover — practical, not pushy. One or two sentences max, ideally woven into a natural point about planning ahead.

---

## Headings

H2s should sound like things a parent would actually say or think.

Good: "The tube is basically useless for changing"
Good: "Drive-throughs are less reliable"
Good: "Museums are surprisingly good"

Bad: "Public Transport Considerations"
Bad: "Venue Accessibility Overview"
Bad: "Tips and Recommendations"

---

## Length

- Location guides: 400-600 words
- Venue guides: 300-450 words

Don't aim for a word count. Write what's useful and stop. Short and useful beats long and padded.

---

## SEO without being weird about it

Include the main search phrase naturally in the first paragraph. Don't repeat it ten times. Write for the reader first, Google second.

Each article needs:
- A clear title that matches what someone would actually search
- A meta description (the `description` field in frontmatter) that reads like a sentence, not a keyword list
- At least one mention of "Clover" and a natural CTA near the end

---

## Images

Use warm, realistic images of babies or parents in everyday situations. Avoid:
- Stock photo poses (forced smiles, perfectly staged scenes)
- Images that look American (US plugs, American road signs, etc.)
- Anything clinical or medical

Available images in `/public/images/blog/`:
- `sleeping-baby.jpg` — newborn sleeping, very warm and soft
- `baby-blue-eyes.jpg` — baby chewing a block, engaging and cute
- `baby-feet.jpg` — baby feet in white blanket, minimal and calm
- `parent-baby-park.jpg` — mum with two young kids on a sofa

Set the `heroImage` frontmatter field to the image path, e.g. `/images/blog/sleeping-baby.jpg`.

---

## Frontmatter template

```yaml
---
title: "Title that matches what parents search for"
description: "One sentence that reads naturally, under 160 characters."
pubDate: YYYY-MM-DD
category: location-guide   # or venue-guide
city: London               # location-guide only
brand: McDonald's          # venue-guide only
heroImage: /images/blog/sleeping-baby.jpg
draft: false
---
```

---

## Prompting AI to write an article

Use this as your base prompt, then fill in the specifics:

```
Write a blog post for Clover, a UK baby changing facilities app. The audience is UK parents with babies or toddlers.

Topic: [topic]
Type: [location guide / venue guide]
Target keyword: [search phrase]

Style rules:
- Conversational, like a parent blogger who actually knows this stuff
- No em dashes
- Short paragraphs (2-3 sentences max)
- No bullet lists for the main content
- No AI phrases: "it's worth noting", "let's explore", "game-changer", etc.
- H2 headings should sound like things a parent would say, not corporate subheadings
- End with a natural mention of Clover and the app, not a hard sell
- UK English throughout (spellings, venue names, brands)
- [400-600 words for location guides / 300-450 for venue guides]
```

---

## Quick checklist before publishing

- [ ] Does the opening sentence get straight to the point?
- [ ] Are all paragraphs 3 sentences or fewer?
- [ ] Are there any em dashes? (remove them)
- [ ] Does it read like a human parent wrote it?
- [ ] Is the meta description under 160 characters and readable as a sentence?
- [ ] Does the title match how a parent would actually search for this?
- [ ] Is there a natural Clover mention near the end?
- [ ] Is `draft: false` set and `heroImage` assigned?
