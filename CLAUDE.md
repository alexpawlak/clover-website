# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (localhost:4321)
npm run build      # Type-check + build (astro check && astro build)
npm run preview    # Preview production build locally
```

There are no test or lint commands beyond what `astro check` provides during build.

## Architecture

**Clover** is a marketing website + admin dashboard for a baby changing facilities finder app. Built with Astro 5 (static-first), Tailwind CSS, and Supabase.

### Rendering Strategy

Most pages are statically pre-rendered. The partner portal is SSR (server-rendered) via the Netlify adapter — each partner-portal page explicitly sets `export const prerender = false`. API routes under `src/pages/api/` are always server-rendered.

### Partner Portal Auth

Cookie-based session management in `src/lib/auth.ts`:
- Login POSTs to Supabase, sets `sb-access-token` (1h) and `sb-refresh-token` (7d) as HttpOnly cookies
- `getUser(cookies)` silently refreshes expired access tokens
- `requireAuth()` redirects to login if unauthenticated — used at the top of every protected page and API route

Two Supabase clients in `src/lib/supabase-admin.ts`:
- `supabaseAuth` — anon key, respects Row-Level Security (used for auth operations)
- `supabaseAdmin` — service role key, bypasses RLS (used for admin data operations)

### Layouts

- `BaseLayout.astro` — public pages; handles SEO meta, Open Graph, canonical URLs
- `StudioLayout.astro` — partner portal pages; includes sidebar nav, git-based "last updated" timestamp via `src/lib/studio-meta.ts`

### Environment Variables

Required in `.env`:
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The service role key is server-only and must never be exposed to the client.

### Tailwind Theme

Custom colors defined in `tailwind.config.mjs`:
- Brand: `pink` (#E91E63), `violet` (#6B73FF)
- Amenity indicators: `blue`, `orange`, `green`
- Status: `success`, `warning`, `error`, `info`
