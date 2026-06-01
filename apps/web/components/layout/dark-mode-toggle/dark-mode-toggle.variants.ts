import { cva } from 'class-variance-authority'

export const trackVariants = cva(
  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  {
    variants: {
      checked: {
        true: 'bg-primary',
        false: 'bg-muted',
      },
    },
    defaultVariants: {
      checked: false,
    },
  },
)

export const thumbVariants = cva(
  'pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-sm ring-0 transition-transform duration-200',
  {
    variants: {
      checked: {
        true: 'translate-x-5',
        false: 'translate-x-0',
      },
    },
    defaultVariants: {
      checked: false,
    },
  },
)
