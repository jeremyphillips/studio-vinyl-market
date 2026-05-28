// Shared CVA vocabulary — establishes the sizing and variant key contracts
// that ui/ primitives conform to. Full Tailwind class strings live in each
// component's own *.variants.ts so static analysis stays intact.

export type SizeVariant = 'sm' | 'default' | 'lg' | 'icon'

export type ColorVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
