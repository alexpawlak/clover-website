# Landing Page Visual Polish — Design Spec

**Date:** 2026-04-05  
**Scope:** Homepage only (`src/pages/index.astro` + related components)  
**Goal:** Align the website's visual identity with the app, replace dated patterns, and remove inconsistencies — without changing page structure or copy.

---

## Decisions Summary

| Area | Before | After |
|------|--------|-------|
| Font | system-ui stack | Inter (Google Fonts) |
| Secondary color | `#6B73FF` violet | `#0875A0` blue (amenity-blue-dark) |
| Secondary light | `#2D3748` | `#ADE5FB` (amenity-blue-light) |
| Community icons | OS emoji (📍 📸 ⭐) | Flat SVG, amenity colors |
| How-it-works circles | Filled, violet step 2 | Outlined, blue step 2, connector lines |
| Hero decoration | Two large blur circles | Removed |
| Hero gradient | pink-light → white → violet | pink-light → white (pink only) |
| Stats placement | Floating card below hero | Inline strip below CTAs, dividers |
| CTA section | Pink → violet gradient | Solid pink `#E91E63` |

---

## 1. Typography

Add Inter via Google Fonts in `BaseLayout.astro`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Update `tailwind.config.mjs` font family:
```js
fontFamily: {
  sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
}
```

---

## 2. Color Token Update

Do **not** remove `accent-violet` from `tailwind.config.mjs` — other pages may reference it. Instead, update usages only in the landing page components touched by this spec (`Hero.astro`, `Features.astro`, `index.astro`).

The replacement tokens already exist:
- `amenity-blue-dark` → `#0875A0` (replaces `accent-violet` in interactive/text roles)
- `amenity-blue-light` → `#ADE5FB` (replaces `accent-violet/10` in bg roles)

---

## 3. Hero Section (`src/components/Hero.astro`)

**Remove:**
- Two decorative `absolute` blur divs (`bg-brand-pink-light/20 blur-3xl` and `bg-accent-violet/10 blur-3xl`)
- Gradient reference to violet: change `to-accent-violet/10` → remove the `to-*` stop entirely

**Gradient becomes:**
```html
<section class="bg-gradient-to-br from-brand-pink-light/20 to-white ...">
```

**Stats strip** — replace the current stats card with an inline strip anchored below the CTA buttons:
```html
<div class="flex divide-x divide-neutral-200 pt-6 mt-6 border-t border-neutral-100">
  <div class="pr-6">
    <div class="text-2xl font-bold text-brand-pink">2,400+</div>
    <div class="text-xs text-neutral-500">Places</div>
  </div>
  <div class="px-6">
    <div class="text-2xl font-bold text-amenity-blue-dark">12k+</div>
    <div class="text-xs text-neutral-500">Users</div>
  </div>
  <div class="pl-6">
    <div class="text-2xl font-bold text-brand-pink">850+</div>
    <div class="text-xs text-neutral-500">Contributions</div>
  </div>
</div>
```

**Secondary CTA button** — update the `.btn-secondary` class in `src/styles/global.css` to use `amenity-blue-dark` (`#0875A0`) instead of violet.

---

## 4. Community Section (in `src/pages/index.astro`)

Replace the three emoji-card items with flat SVG icon cards. Each icon uses its amenity color:

| Card | Icon | Color |
|------|------|-------|
| Pin a location | Location pin SVG | `brand-pink` / `brand-pink-light` bg |
| Share photos | Camera SVG | `amenity-blue-dark` / `amenity-blue-light` bg |
| Rate it | Star SVG | `amenity-orange-dark` / `amenity-orange-light` bg |

Icon style: 18×18px, stroke only, `stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"` — matching the existing feature section icons.

Icon container: `w-10 h-10 rounded-xl flex items-center justify-center` with 10% opacity background (e.g. `bg-brand-pink/10`).

---

## 5. How It Works Section (in `src/pages/index.astro`)

**Step circles** — switch from filled to outlined:
```html
<!-- Before -->
<div class="w-10 h-10 rounded-full bg-brand-pink flex items-center ...">1</div>

<!-- After -->
<div class="w-10 h-10 rounded-full border-2 border-brand-pink text-brand-pink flex items-center ...">1</div>
```

**Step 2 color** — change from `accent-violet` → `amenity-blue-dark`.

**Connector lines** — add a horizontal rule between steps on desktop:
```html
<div class="hidden md:block h-px bg-neutral-200 flex-1 mt-5 mx-3"></div>
```
Wrap steps in a `flex items-start` container instead of a `grid`.

---

## 6. CTA Section (in `src/pages/index.astro`)

Replace gradient background with solid pink:
```html
<!-- Before -->
<section class="bg-gradient-to-r from-brand-pink to-accent-violet ...">

<!-- After -->
<section class="bg-brand-pink ...">
```

No other changes — white buttons and text already work correctly on solid pink.

---

## 7. Violet → Blue Sweep (landing page files only)

After the above targeted changes, check for any remaining `accent-violet` references in the files touched by this spec:

```bash
grep "accent-violet" src/components/Hero.astro src/components/Features.astro src/pages/index.astro src/styles/global.css
```

Replace remaining instances with `amenity-blue-dark` or `amenity-blue-light` as appropriate. Do not touch other pages — that is out of scope.

---

## Verification

1. Run `npm run dev` and open `http://localhost:4321`
2. Check hero: no blur circles visible, gradient is pink-only, stats appear inline below buttons
3. Check font: headings and body render in Inter (DevTools → Computed → font-family)
4. Check community section: flat SVG icons visible, no emoji
5. Check how-it-works: outlined circles, connector lines visible on desktop, step 2 is blue
6. Check CTA section: solid pink background, no gradient
7. Run `grep -r "accent-violet\|6B73FF" src/` — should return no results
8. Check mobile (375px): stats strip stays legible (3 items in a row at small size — if too cramped, hide on mobile with `hidden sm:flex`), steps still readable
