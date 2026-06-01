# Components

## Directory structure

```
components/
├── catalog/        Vinyl-domain components (cover image, release card, tracklist, Discogs meta)
├── errors/         Error and not-found content components
├── layout/         App shell (header, nav, dark mode toggle)
├── page-builder/   CMS pageBuilder block renderers
├── portable-text/  Sanity PortableText renderer
├── preview/        Draft / Presentation Tool components
├── providers/      React context providers
└── ui/             Design-system primitives (button, card, typography, navigation-menu)
```

---

## Server vs client components

| Convention          | Rule                                                     |
| ------------------- | -------------------------------------------------------- |
| `<name>.tsx`        | Server component — no `'use client'`, no browser APIs    |
| `<name>.client.tsx` | Client component — `'use client'` must be the first line |

Default to server. Use `.client.tsx` only for browser APIs, event handlers, state/effects, or hooks.

---

## CVA pattern (`components/ui/`)

```
<primitive>/
├── index.ts                  Barrel export
├── <primitive>.variants.ts   cva() — all Tailwind class strings live here
├── <primitive>.types.ts      Optional — add when exporting non-trivial prop types for consumers
├── <primitive>.tsx           Component — no raw class strings
└── <primitive>.stories.tsx   Storybook (CSF3)
```

Rules:

- All Tailwind strings in `*.variants.ts`; use `cn()` for composition in the component
- Use `VariantProps<typeof yourVariants>` for prop typing
- Export component and variant props from `index.ts`
- New primitives require a story and unit test before committing

---

## `cn()` utility

```ts
import { cn } from '@/lib/utils'
```

Combines `clsx` + `tailwind-merge`. Use for conditional or merged classes — never concatenate raw strings.

---

## Radix UI

Only two Radix primitives are in use:

| Package                           | Where                         |
| --------------------------------- | ----------------------------- |
| `@radix-ui/react-slot`            | `button/` — `asChild` support |
| `@radix-ui/react-navigation-menu` | `navigation-menu/`            |

Do not add new Radix packages without discussion.

---

## Storybook

Stories are co-located with the component. Use CSF3: `Meta<typeof Component>` default export, `StoryObj<typeof Component>` named exports. Run: `yarn workspace @vinyl-market/web storybook` (port 6006).

---

## shadcn / new-york baseline

Add new components with `npx shadcn@latest add <name>`, then move class strings to `*.variants.ts`, add a barrel export, story, and test.
