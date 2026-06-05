import { cva } from 'class-variance-authority'

export const textVariants = cva('', {
  variants: {
    /**
     * Visual size — decoupled from the HTML element.
     * Heading sizes map to the type scale tokens in globals.css.
     * Body sizes include generous line-height for reading comfort.
     */
    size: {
      h1: 'text-h1',
      h2: 'text-h2',
      h3: 'text-h3',
      h4: 'text-h4',
      h5: 'text-h5',
      'body-lg': 'text-body-lg',
      'body-md': 'text-body-md',
      'body-sm': 'text-body-sm',
      small: 'text-small',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    /**
     * tight    → headings / hero text
     * comfortable → default (neutral)
     * relaxed  → body copy, captions
     * wide     → labels / eyebrows (uppercase + spaced)
     */
    tracking: {
      tight: 'tracking-tight',
      comfortable: 'tracking-comfortable',
      relaxed: 'tracking-relaxed',
      wide: 'tracking-wide',
    },
    /** Semantic color aliases — maps to existing shadcn color tokens. */
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      subtle: 'text-foreground/60',
    },
    /** Uppercase transform — used for label / eyebrow patterns. */
    uppercase: {
      true: 'uppercase',
      false: '',
    },
    /** Single-line truncation with trailing ellipsis. */
    truncate: {
      true: 'truncate',
      false: '',
    },
    /** Multi-line clamp. Use `lines` prop on <Text> which maps here. */
    lines: {
      1: 'line-clamp-1',
      2: 'line-clamp-2',
      3: 'line-clamp-3',
      4: 'line-clamp-4',
    },
  },
  defaultVariants: {
    size: 'body-md',
    weight: 'normal',
    tracking: 'comfortable',
    color: 'default',
  },
})

// fallow-ignore-next-line unused-type
export type TextVariants = Parameters<typeof textVariants>[0]
