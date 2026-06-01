# Testing

## Stack

| Tool                                                                     | Role                                  |
| ------------------------------------------------------------------------ | ------------------------------------- |
| [Vitest](https://vitest.dev)                                             | Test runner (jsdom environment)       |
| [@testing-library/react](https://testing-library.com/react)              | Component rendering and queries       |
| [@testing-library/user-event](https://testing-library.com/user-event)    | Simulated user interactions           |
| [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) | DOM assertion matchers                |
| [vitest-axe](https://github.com/chaance/vitest-axe)                      | Accessibility assertions via axe-core |

Run tests:

```bash
yarn workspace @vinyl-market/web test        # single run
yarn workspace @vinyl-market/web test:watch  # watch mode
```

---

## File conventions

Tests are co-located with the component they cover:

```
components/
  ui/
    button/
      button.client.tsx
      button.test.tsx        ← test lives here
      button.variants.ts
      button.stories.tsx
```

Shared test utilities go in a `*.test-utils.ts` file alongside the tests they support (see `errors/not-found/not-found.test-utils.ts` for an example).

---

## Setup file

`vitest.setup.ts` runs before every test file. It:

- Extends `expect` with `@testing-library/jest-dom` matchers
- Extends `expect` with `vitest-axe` matchers (`toHaveNoViolations`)
- Calls `cleanup()` after each test to unmount components

Do not import `expect` from `'vitest'` in setup files — use the global `expect` that Vitest provides.

---

## Querying the DOM

Prefer queries in this order (most to least accessible):

1. `getByRole` — reflects how assistive technology sees the element
2. `getByLabelText` — for form inputs
3. `getByText` — for visible text
4. `getByTestId` — last resort only; avoid `data-testid` unless nothing else works

Do not query by class name or CSS selector.

---

## Accessibility testing

Every component test file for a UI or interactive component should include at least one axe assertion:

```tsx
import { axe } from 'vitest-axe'

it('has no accessibility violations', async () => {
  const { container } = render(<MyComponent />)
  expect(await axe(container)).toHaveNoViolations()
})
```

axe-core runs WCAG 2.2 AA rules against the rendered DOM (axe-core 4.8+ covers 2.2; this project uses 4.12). It catches missing labels, invalid ARIA, heading order violations, and more. It does not replace manual testing or screen reader testing.

### When to add an axe test

- Any component in `ui/` or `layout/`
- Any interactive component (buttons, toggles, menus, forms)
- Any component that renders a semantic landmark (`nav`, `main`, `section` with a label, etc.)
- Not required for pure data/API utilities or server-only components that render no HTML

---

## Mocking conventions

### `next/image`

`next/image` is not compatible with jsdom. Mock it in any test file that renders a component using it:

```ts
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} />
  ),
}))
```

### `@/sanity/image` (`urlFor`)

Components that call `urlFor` need it mocked so they don't attempt a real Sanity URL build:

```ts
vi.mock('@/sanity/image', () => ({
  urlFor: () => ({
    width: () => ({
      height: () => ({
        url: () => 'https://cdn.example.com/cover.jpg',
      }),
    }),
  }),
}))
```

Storybook uses a webpack alias to swap in `__mocks__/sanity-image.ts` instead. The Vitest mock achieves the same in tests.

### `next-sanity` hooks

For components that call `useIsPresentationTool` (preview mode detection), mock the hook:

```ts
vi.mock('next-sanity/hooks', () => ({
  useIsPresentationTool: () => false,
}))
```

---

## Zustand stores

Zustand stores persist state across tests within the same file. Reset store state in `afterEach` to prevent test bleed:

```ts
import { useThemeStore } from '@/stores/theme-store'

afterEach(() => {
  useThemeStore.setState({ isDark: false })
})
```

To pre-seed state for a specific test, call `setState` before rendering:

```ts
it('renders in dark mode', () => {
  useThemeStore.setState({ isDark: true })
  render(<DarkModeToggle />)
  // ...
})
```

---

## Accessibility layers

This project enforces accessibility at four levels:

| Layer      | Tool                                        | When it runs                    | Catches real CSS |
| ---------- | ------------------------------------------- | ------------------------------- | ---------------- |
| Write-time | `eslint-plugin-jsx-a11y`                    | On every file save / pre-commit | No               |
| Test-time  | `vitest-axe`                                | `yarn test` / CI                | No (jsdom)       |
| Dev review | `@storybook/addon-a11y`                     | Storybook panel per story       | Yes              |
| CI         | `@storybook/test-runner` + `axe-playwright` | Every push / PR                 | Yes              |

The ESLint rules catch static issues (missing `alt`, invalid ARIA roles, keyboard-inaccessible elements). The axe runtime tests catch structural issues that require a rendered DOM (landmark order, focus management). The Storybook addon provides a visual audit panel while building components. The test runner is the highest-fidelity layer — it runs every story headlessly in Playwright with real computed CSS, which means **color contrast is accurately reported**.

---

## Storybook test runner

The test runner runs every story against axe-core via Playwright. It is configured in `.storybook/test-runner.ts`.

Run locally against a static build:

```bash
yarn workspace @vinyl-market/web build-storybook
npx http-server apps/web/storybook-static --port 6006 &
yarn workspace @vinyl-market/web test-storybook --url http://127.0.0.1:6006
```

Or against a running dev Storybook:

```bash
yarn workspace @vinyl-market/web storybook &
yarn workspace @vinyl-market/web test-storybook
```

CI runs this automatically via `.github/workflows/storybook-a11y.yml` on every push to feature branches and on PRs to `main`. The Storybook static build is uploaded as an artifact on failure so violations can be inspected.

### Suppressing a false positive on a specific story

If a story has a known violation that cannot be fixed (e.g. a third-party component), disable the rule at the story level only:

```ts
export const MyStory: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
}
```

Do not disable rules globally in `preview.tsx` unless the entire component library has the same constraint.
