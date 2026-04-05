# Blog Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the plain stacked-card blog listing with a featured-hero + 3-col grid layout using blush-pink brand colours.

**Architecture:** Single file change to `src/pages/blog/index.astro`. Destructure the sorted posts array into `[featuredPost, ...restPosts]` — the first (newest) becomes the hero card, the rest go into a 3-column grid. No new components, no schema changes.

**Tech Stack:** Astro 5, Tailwind CSS (custom `brand-*` colour tokens), TypeScript

---

### Task 1: Implement the redesigned blog index page

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] **Step 1: Replace the contents of `src/pages/blog/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

const [featuredPost, ...restPosts] = posts;

const categoryLabel = (cat: string) => {
  if (cat === 'location-guide') return 'Location Guide';
  if (cat === 'venue-guide') return 'Venue Guide';
  return 'Tips';
};
---

<BaseLayout
  title="Baby Changing Tips & UK Location Guides — Clover Blog"
  description="Guides for parents finding baby changing tables and family facilities across the UK."
>
  <Header />

  <main class="py-16 bg-brand-pink/5 min-h-screen">
    <div class="container-custom">

      <div class="max-w-2xl mx-auto mb-12 text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
          The Clover Blog
        </h1>
        <p class="text-lg text-neutral-600">
          Practical guides for parents finding baby-friendly facilities across the UK.
        </p>
      </div>

      {featuredPost && (
        <a
          href={`/blog/${featuredPost.slug}`}
          class="block mb-10 rounded-2xl border border-brand-pink/20 shadow-md bg-gradient-to-br from-brand-pink-light/40 to-brand-pink-light/60 overflow-hidden group hover:shadow-lg transition-shadow"
        >
          <div class="flex flex-col md:flex-row">
            <div class="md:w-56 w-full h-48 md:h-auto flex-shrink-0">
              {featuredPost.data.heroImage ? (
                <img
                  src={featuredPost.data.heroImage}
                  alt={featuredPost.data.title}
                  class="w-full h-full object-cover"
                />
              ) : (
                <div class="w-full h-full bg-brand-pink/20 min-h-[12rem] md:min-h-0" />
              )}
            </div>
            <div class="p-6 md:p-8 flex flex-col justify-center">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-xs font-semibold px-3 py-1 rounded-full bg-brand-pink/10 text-brand-pink">
                  {categoryLabel(featuredPost.data.category)}
                </span>
                <span class="text-xs text-neutral-500">
                  {featuredPost.data.pubDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <h2 class="text-xl md:text-2xl font-bold text-neutral-900 mb-3 group-hover:text-brand-pink transition-colors">
                {featuredPost.data.title}
              </h2>
              <p class="text-neutral-600 leading-relaxed mb-4">
                {featuredPost.data.description}
              </p>
              <span class="text-brand-pink font-semibold text-sm">Read more →</span>
            </div>
          </div>
        </a>
      )}

      {restPosts.length > 0 && (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restPosts.map((post) => (
            <a
              href={`/blog/${post.slug}`}
              class="bg-white rounded-xl border border-brand-pink/10 shadow-sm overflow-hidden hover:shadow-md transition-shadow block group"
            >
              <div class="h-40 bg-brand-pink/10 overflow-hidden">
                {post.data.heroImage ? (
                  <img
                    src={post.data.heroImage}
                    alt={post.data.title}
                    class="w-full h-full object-cover"
                  />
                ) : (
                  <div class="w-full h-full" />
                )}
              </div>
              <div class="p-5">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-pink/10 text-brand-pink">
                    {categoryLabel(post.data.category)}
                  </span>
                  <span class="text-xs text-neutral-500">
                    {post.data.pubDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h2 class="text-base font-bold text-neutral-900 mb-2 group-hover:text-brand-pink transition-colors leading-snug">
                  {post.data.title}
                </h2>
                <p class="text-sm text-neutral-600 leading-relaxed line-clamp-2">
                  {post.data.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}

    </div>
  </main>

  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Run type-check**

```bash
npm run build
```

Expected: build succeeds with no type errors. If `astro check` flags an issue with the destructuring assignment `const [featuredPost, ...restPosts] = posts`, add an explicit type annotation: `const [featuredPost, ...restPosts]: typeof posts = posts;`

- [ ] **Step 3: Preview in browser**

```bash
npm run dev
```

Open `http://localhost:4321/blog` and verify:
- Page has a soft blush background
- Most recent post appears as a wide horizontal hero card with blush gradient
- Remaining posts appear in a 3-column grid (2-col on tablet, 1-col on mobile)
- Hero images render correctly where present; blush placeholder where absent
- Category badges are pink pills
- Hover on hero card and grid cards turns title colour to brand-pink

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: redesign blog index with hero card and pink grid layout"
```
