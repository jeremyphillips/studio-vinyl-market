# Agent Conventions

Full file-scoped rules live in `.cursor/rules/` — read the relevant rule before starting work in that area.

---

## Quality gates

Work is not done until all three pass from the repo root:

```bash
yarn typecheck
yarn lint
yarn test
```

## Accessibility

Target: **WCAG 2.2 AA**. Every UI or interactive component must pass `vitest-axe` assertions, the Storybook test runner's axe-playwright check, and not introduce `eslint-plugin-jsx-a11y` violations. Do not suppress axe rules globally.

## Git safety

Check `git status --short` before deleting anything. Never remove untracked files or directories without explicit instruction.

## Documentation

Before closing a task, check whether any file in `apps/web/docs/` needs updating. If unsure, ask. Recommend a new doc if substantial work has no existing home.

---

## Component authoring — `.cursor/rules/component-authoring.mdc`

Docs: `apps/web/docs/design-system.md`, `apps/web/docs/components.md`

- Every new component requires co-located `*.stories.tsx` (CSF3) and `*.test.tsx`
- Client: `<name>.client.tsx` + `'use client'`; server: `<name>.tsx`, no directive
- UI primitives follow the CVA pattern: `index.ts`, `*.variants.ts`, `*.tsx`, `*.stories.tsx`, optional `*.types.ts`
- All Tailwind classes in `*.variants.ts` — prefer named CVA variants over long inline strings
- Never hardcode color values or font sizes — use design token classes

---

## Testing — `.cursor/rules/testing-standards.mdc`

Docs: `apps/web/docs/testing.md`

- Query order: `getByRole` → `getByLabelText` → `getByText` → `getByTestId`
- Every `ui/` or interactive component test must include an `axe` assertion

---

## Sanity Studio — `.cursor/rules/sanity-studio.mdc`

Docs: `apps/web/docs/content-modeling.md`

- Cursor agents: read the **Sanity best-practices skill** from `available_skills`. Other agents: consult [Sanity docs](https://www.sanity.io/docs).
- Run `yarn typegen` after any schema change
- `buttonBlock.ts` variant/size options are the CVA SSoT — changes require `yarn typegen`
- Use exported singleton ID constants (`SITE_SETTINGS_ID`, `RELEASES_PAGE_ID`) — never hardcode

---

## Type conventions

- Prefer `Pick`, `Omit`, `Partial`, `extends` over duplicating type shapes
- Route paths → `apps/web/lib/routes.ts` (`SLUG_PATH_BY_TYPE`, `FIXED_PATH_BY_TYPE`)
- Any string literal used in 2+ places → extract to a named constant
