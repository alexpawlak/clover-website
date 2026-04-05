# Analytics — Design Spec

**Date:** 2026-04-05
**Status:** Approved

## Context

The Clover marketing website has no analytics. We want to understand traffic (which pages get visits, where visitors come from, which blog posts perform) and visitor intent (CTA clicks, app download link clicks). Privacy is a priority — no cookie banner, no GDPR complexity.

The partner portal at `/partner-portal` is **internal-only** — only the Clover team uses it to manage offers. It should be excluded from analytics so internal traffic doesn't pollute public visitor data.

---

## Approach: Umami, self-hosted on Railway

**Umami** is a cookieless, open-source analytics tool. It is GDPR-compliant out of the box with no consent banner required. Self-hosted on Railway (free tier) with a managed Postgres database.

### Why Umami on Railway
- Free (Railway free tier: 500 hrs/mo)
- No cookie banner needed — cookieless by design
- Privacy policy stays clean, no changes needed
- Simple script tag integration, no npm package required
- Custom events via HTML attributes (`data-umami-event`) — no JS needed

---

## Infrastructure

1. Deploy Umami to Railway using the official Umami template (includes Postgres)
2. Railway provides a public URL (e.g. `umami-production-xxxx.up.railway.app`)
3. Optionally point a subdomain (e.g. `analytics.clover-babymap.com`) at it later
4. Create a site in the Umami dashboard → get a **Website ID** and **script src URL**

---

## Website Integration

### Script injection
Add the Umami tracking script to `src/layouts/BaseLayout.astro` inside `<head>`:

```html
<script
  defer
  src="https://<your-umami-host>/script.js"
  data-website-id="<your-website-id>"
></script>
```

### Coverage
- **BaseLayout.astro** — covers all public pages (index, about, for-venues, terms, privacy, delete-account)
- **BlogPostLayout.astro** — wraps BaseLayout, so blog posts are covered automatically
- **StudioLayout.astro** — NOT modified; partner portal pages remain untracked

No environment variable needed — the script src and website ID are public-safe values.

---

## Custom Events

Umami tracks pageviews automatically. Custom events use `data-umami-event` HTML attributes — no JavaScript required.

| Event name | Element | Location |
|---|---|---|
| `app-store-click` | App Store download link | Homepage, any CTA |
| `play-store-click` | Google Play download link | Homepage, any CTA |
| `venues-cta-click` | "For Venues" CTA button/link | Homepage, for-venues page |

Example:
```html
<a href="..." data-umami-event="app-store-click">Download on App Store</a>
```

---

## What we are NOT tracking
- Partner portal pages (`/partner-portal/*`) — internal team only
- No user identification or PII
- No session recording
- No ad/marketing SDKs

---

## Verification

1. Deploy Umami to Railway and confirm dashboard loads
2. Add script to BaseLayout, deploy to Netlify
3. Visit the public site — confirm pageview appears in Umami dashboard within seconds
4. Click an instrumented CTA — confirm custom event appears in Umami
5. Visit `/partner-portal` — confirm NO pageview appears in Umami
