# Architecture — apps/web

Vinyl Market's web app is a Next.js 16 / Tailwind v4 / Sanity monorepo application. It uses the App Router, React Server Components, and a shadcn-compatible component system built on CVA and Radix primitives.

## Topics

| Doc | Summary |
|---|---|
| [Design System](docs/design-system.md) | Token layer, typography system, CVA component pattern, Portable Text |
| [Data Fetching](docs/data-fetching.md) | Sanity client, GROQ queries, `sanityFetch`, live mode, draft preview |
| [Components](docs/components.md) | File conventions, naming, server vs. client split, Storybook |
| [Routing](docs/routing.md) | App Router pages, metadata, static params, error/not-found boundaries |
| [Content Modeling](docs/content-modeling.md) | Sanity schema conventions, TypeGen, fragment patterns |

## Key dependencies

| Package | Role |
|---|---|
| `next` ^16 | Framework — App Router, RSC, `next/font` |
| `tailwindcss` ^4 | CSS-first styling (no `tailwind.config.ts`) |
| `class-variance-authority` | Variant-driven component styling (CVA) |
| `@radix-ui/*` | Accessible UI primitives |
| `zustand` | Lightweight client state management (`stores/`) |
| `next-sanity` | Sanity client, live mode, Visual Editing |
| `@portabletext/react` | Sanity rich-text renderer |
| `clsx` + `tailwind-merge` | `cn()` utility for conditional class merging |
