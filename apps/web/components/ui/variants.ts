// Shared CVA vocabulary — establishes the sizing and variant key contracts
// that ui/ primitives conform to. Full Tailwind class strings live in each
// component's own *.variants.ts so static analysis stays intact.
//
// Derived from the Sanity `ButtonBlock` schema type so the studio schema is
// the single source of truth. After changing variant/size options in
// buttonBlock.ts, run `yarn typegen` and any missing CVA keys will surface as
// TypeScript errors via the `satisfies Record<ColorVariant, string>` guards.
import type { ButtonBlock } from '@/sanity/types.generated'

export type ColorVariant = NonNullable<ButtonBlock['variant']>
export type SizeVariant = NonNullable<ButtonBlock['size']>
