import {
  PortableText as PortableTextBase,
  type PortableTextComponents,
  type PortableTextBlock,
  type PortableTextReactComponents,
} from '@portabletext/react'

import { H1, H2, H3, H4, P, Prose } from '@/components/ui/typography'

// ─── Default component map ────────────────────────────────────────────────────
// Maps Portable Text block styles and marks to typography primitives.
// Override any key by passing `components` to <PortableText>.

const defaultComponents: PortableTextComponents = {
  block: {
    // Heading styles
    h1: ({ children }) => <H1>{children}</H1>,
    h2: ({ children }) => <H2>{children}</H2>,
    h3: ({ children }) => <H3>{children}</H3>,
    h4: ({ children }) => <H4>{children}</H4>,
    // Body styles
    normal: ({ children }) => <P>{children}</P>,
    blockquote: ({ children }) => (
      <blockquote className="border-border text-muted-foreground my-4 border-l-2 pl-4 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-4 list-disc space-y-1 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="mb-4 list-decimal space-y-1 pl-6">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="text-body-md">{children}</li>,
    number: ({ children }) => <li className="text-body-md">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="text-small bg-muted rounded px-1 py-0.5 font-mono">{children}</code>
    ),
    underline: ({ children }) => <span className="underline">{children}</span>,
    'strike-through': ({ children }) => <s>{children}</s>,
    link: ({ value, children }) => {
      const href: string = value?.href ?? '#'
      const isExternal = href.startsWith('http')
      return (
        <a
          href={href}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="decoration-foreground/40 hover:decoration-foreground underline underline-offset-2 transition-[text-decoration-color]"
        >
          {children}
        </a>
      )
    },
  },
}

// ─── Props ────────────────────────────────────────────────────────────────────

type PortableTextValue = PortableTextBlock | PortableTextBlock[]

interface PortableTextProps {
  value: PortableTextValue
  /**
   * Override or extend the default component map.
   * Merged shallowly with the defaults — supply only the keys you want to change.
   */
  components?: Partial<PortableTextReactComponents>
  /**
   * When true, wraps output in a <Prose> container that applies sensible
   * spacing and reading defaults between elements. Useful for long-form CMS
   * content like article bodies or release descriptions.
   *
   * @default false
   */
  prose?: boolean
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Sanity Portable Text renderer backed by the project typography system.
 *
 * @example
 * // Inline usage — spacing managed by parent layout
 * <PortableText value={release.description} />
 *
 * @example
 * // Long-form article body with Prose wrapper
 * <PortableText value={page.body} prose />
 *
 * @example
 * // Override a single block style
 * <PortableText
 *   value={content}
 *   components={{ block: { h1: ({children}) => <H1 size="h2">{children}</H1> } }}
 * />
 */
function PortableText({ value, components, prose = false, className }: PortableTextProps) {
  const merged: PortableTextComponents = components
    ? { ...defaultComponents, ...components }
    : defaultComponents

  const content = <PortableTextBase value={value} components={merged} />

  if (prose) {
    return <Prose className={className}>{content}</Prose>
  }

  if (className) {
    return <div className={className}>{content}</div>
  }

  return content
}

export { PortableText }
export type { PortableTextProps, PortableTextValue }
