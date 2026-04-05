# Blog Page Redesign

**Date:** 2026-04-05
**Status:** Approved
**File:** `src/pages/blog/index.astro`

## Goal

Make the blog listing page more visually appealing by replacing the plain stacked-card list with a featured-hero + grid layout, using the brand's pink colour throughout.

## Layout

The page uses two distinct zones:

**1. Featured hero card** (latest post)
- Full-width horizontal card, spanning the content column
- Hero image (or blush placeholder) on the left, ~160px wide
- Post metadata, title, description, and "Read more →" link on the right
- This is always the most recent post (posts are already sorted by date descending)

**2. Secondary grid** (all remaining posts)
- 3-column CSS grid
- Each card: blush image area on top, then category badge + title + short description below
- Cards are equal height within each row; image area is a fixed height (~60–70px) with actual hero image via `object-cover` when available, blush gradient placeholder otherwise
- On mobile (< `md`): grid collapses to 1 column; hero card stacks vertically (image on top, content below)

## Colour Treatment

All colour values use the existing custom Tailwind theme (see `tailwind.config.mjs`). There is no standard Tailwind `pink-*` scale — only the custom `brand-*` tokens.

| Element | Class |
|---|---|
| Page background | `bg-brand-pink/5` (very light blush wash) |
| Hero card background | `bg-gradient-to-br from-brand-pink-light/40 to-brand-pink-light/60` |
| Hero card border | `border border-brand-pink/20` |
| Hero card shadow | `shadow-md` |
| Hero title | `text-neutral-900` |
| Hero description | `text-neutral-600` |
| Hero "Read more" link | `text-brand-pink font-semibold` |
| Grid card background | `bg-white` |
| Grid card border | `border border-brand-pink/10` |
| Grid card image area | `bg-brand-pink/10` (blush placeholder; actual image via `object-cover`) |
| Grid card title | `text-neutral-900` |
| Grid card description | `text-neutral-600` |
| Category badge | `bg-brand-pink/10 text-brand-pink` (already in Tailwind safelist) |
| Date text | `text-neutral-500` |

The violet brand colour (`accent-violet`) is not used on this page — the brand-pink family carries the palette.

## Category Badges

Two categories currently exist:
- `location-guide` → label "Location Guide"
- `venue-guide` → label "Venue Guide"
- `tips` → label "Tips"

All badges use the same blush/rose pill style regardless of category. The existing `categoryLabel` helper can be reused; the `categoryColour` helper is replaced by the unified pink style.

## Hero Image Handling

- If `post.data.heroImage` is set: render it as `<img>` with `object-cover` in the image slot
- If not set: render the blush gradient div as a placeholder
- This applies to both the hero card and the grid cards

## Page Header

Centred, no background change (sits on the blush page background):
- `h1`: `text-pink-900`, existing font size/weight
- Subtitle `p`: `text-pink-700`

## Responsive Behaviour

- **Mobile (`< md`):** Hero card stacks — image full-width on top (~180px tall), content below. Grid becomes single column.
- **Tablet (`md`):** Grid is 2 columns. Hero card stays horizontal.
- **Desktop (`lg+`):** Full 3-column grid, hero card horizontal.

## Scope

Changes are limited to `src/pages/blog/index.astro` only. No changes to `BlogPostLayout.astro`, individual post files, content schema, or any other page.

## What Does Not Change

- Post data fetching and sort order
- Slug routing
- SEO meta / BaseLayout usage
- Header and Footer components
- The `[slug].astro` post page
