import * as React from 'react'
import {type VariantProps} from 'class-variance-authority'

import {cn} from '@/lib/utils'
import {textVariants} from './typography.variants'

// ─── Types ───────────────────────────────────────────────────────────────────

type TextVariantProps = VariantProps<typeof textVariants>

type AsProp<E extends React.ElementType> = {
  as?: E
}

type TextOwnProps<E extends React.ElementType> = AsProp<E> &
  TextVariantProps & {
    className?: string
    children?: React.ReactNode
  }

type TextProps<E extends React.ElementType> = TextOwnProps<E> &
  Omit<React.ComponentPropsWithRef<E>, keyof TextOwnProps<E>>

// ─── Base <Text> ─────────────────────────────────────────────────────────────

/**
 * Polymorphic base typography primitive.
 *
 * The `as` prop controls the rendered HTML element; all other props control
 * visual presentation independently. This allows semantic headings to render
 * at any visual size, and vice versa.
 *
 * @example
 * // h3 element rendered at h2 scale
 * <Text as="h3" size="h2" weight="semibold" tracking="tight">Section</Text>
 *
 * // Muted caption
 * <Text as="span" size="small" color="muted">Last updated 3 days ago</Text>
 */
function Text<E extends React.ElementType = 'p'>({
  as,
  size,
  weight,
  tracking,
  color,
  uppercase,
  truncate,
  lines,
  className,
  ...props
}: TextProps<E>) {
  const Comp = (as ?? 'p') as React.ElementType
  return (
    <Comp
      className={cn(
        textVariants({size, weight, tracking, color, uppercase, truncate, lines}),
        className,
      )}
      {...props}
    />
  )
}

// ─── Named wrappers ──────────────────────────────────────────────────────────
// Each wrapper locks in semantic defaults while leaving all props overridable.
// Responsive scale: h1–h3 step down on smaller viewports so layout doesn't
// need to manage font sizes manually on every page.

type HeadingProps = Omit<TextProps<'h1'>, 'as'>

/**
 * Top-level page heading. Renders an `<h1>` at h3 (mobile) → h2 (md) → h1 (lg).
 * Override `size` to decouple visual scale from semantic level.
 */
function H1({className, size, weight = 'semibold', tracking = 'tight', ...props}: HeadingProps) {
  return (
    <Text
      as="h1"
      size={size}
      weight={weight}
      tracking={tracking}
      className={cn(!size && 'text-h3 md:text-h2 lg:text-h1', className)}
      {...props}
    />
  )
}

/**
 * Section heading. Renders an `<h2>` at h4 (mobile) → h3 (md) → h2 (lg).
 */
function H2({className, size, weight = 'semibold', tracking = 'tight', ...props}: HeadingProps) {
  return (
    <Text
      as="h2"
      size={size}
      weight={weight}
      tracking={tracking}
      className={cn(!size && 'text-h4 md:text-h3 lg:text-h2', className)}
      {...props}
    />
  )
}

/**
 * Sub-section heading. Renders an `<h3>` at h5 (mobile) → h4 (md) → h3 (lg).
 */
function H3({className, size, weight = 'semibold', tracking = 'tight', ...props}: HeadingProps) {
  return (
    <Text
      as="h3"
      size={size}
      weight={weight}
      tracking={tracking}
      className={cn(!size && 'text-h5 md:text-h4 lg:text-h3', className)}
      {...props}
    />
  )
}

/** Card or list heading — fixed size, no responsive scaling. */
function H4({weight = 'semibold', tracking = 'tight', ...props}: HeadingProps) {
  return <Text as="h4" size="h4" weight={weight} tracking={tracking} {...props} />
}

/** Label-weight inline heading — fixed size. */
function H5({weight = 'medium', tracking = 'comfortable', ...props}: HeadingProps) {
  return <Text as="h5" size="h5" weight={weight} tracking={tracking} {...props} />
}

// ─── Body ────────────────────────────────────────────────────────────────────

type PProps = Omit<TextProps<'p'>, 'as'> & {
  /** Convenience shorthand for the three body copy tiers. Defaults to 'md'. */
  size?: 'body-lg' | 'body-md' | 'body-sm'
}

/**
 * Body paragraph. Defaults to `body-md` with `relaxed` tracking for reading comfort.
 */
function P({tracking = 'relaxed', size = 'body-md', ...props}: PProps) {
  return <Text as="p" size={size} tracking={tracking} {...props} />
}

/** Fine-print / caption text. Renders a `<small>` element. */
function Small({color = 'muted', ...props}: Omit<TextProps<'small'>, 'as'>) {
  return <Text as="small" size="small" color={color} {...props} />
}

/**
 * Eyebrow / label. Uppercase, wide letter-spacing.
 * Renders a `<span>` by default — override with `as` for semantic context
 * (e.g. `as="h3"` when the label is the only heading in a section).
 */
function Label<E extends React.ElementType = 'span'>({
  weight = 'medium',
  tracking = 'wide',
  size = 'small',
  color = 'muted',
  ...props
}: Omit<TextProps<E>, 'uppercase'>) {
  return (
    <Text<E> size={size} weight={weight} tracking={tracking} color={color} uppercase {...(props as TextProps<E>)} />
  )
}

// ─── Prose ───────────────────────────────────────────────────────────────────

type ProseProps = React.ComponentPropsWithRef<'div'>

/**
 * Long-form content wrapper for CMS-rendered HTML (Portable Text, rich text,
 * Markdown, etc.). Applies sensible typography defaults to unstyled child
 * elements so page components don't need to add text classes to every node.
 *
 * Extend with additional selectors in globals.css or via `className`.
 */
function Prose({className, ...props}: ProseProps) {
  return (
    <div
      className={cn(
        // Base reading styles
        'text-body-md tracking-relaxed text-foreground',
        // Headings
        '[&_h1]:text-h1 [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:mb-4',
        '[&_h2]:text-h2 [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:mt-8 [&_h2]:mb-3',
        '[&_h3]:text-h3 [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:mt-6 [&_h3]:mb-2',
        '[&_h4]:text-h4 [&_h4]:font-semibold [&_h4]:tracking-tight [&_h4]:mt-4 [&_h4]:mb-2',
        '[&_h5]:text-h5 [&_h5]:font-medium [&_h5]:mt-4 [&_h5]:mb-1',
        // Paragraphs and lists
        '[&_p]:mb-4 [&_p:last-child]:mb-0',
        '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6',
        '[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6',
        '[&_li]:mb-1',
        // Inline
        '[&_strong]:font-semibold',
        '[&_em]:italic',
        '[&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-foreground/40 hover:[&_a]:decoration-foreground',
        '[&_code]:font-mono [&_code]:text-small [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded',
        // Block
        '[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic',
        className,
      )}
      {...props}
    />
  )
}

export {Text, H1, H2, H3, H4, H5, P, Small, Label, Prose}
