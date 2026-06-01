import type { Meta, StoryObj } from '@storybook/react'

import { Text, H1, H2, H3, H4, H5, P, Small, Label, Prose } from './typography'

// ─── Base <Text> ─────────────────────────────────────────────────────────────

const textMeta: Meta<typeof Text> = {
  title: 'UI/Typography/Text',
  component: Text,
  parameters: { layout: 'padded' },
  argTypes: {
    as: {
      control: 'select',
      options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'small', 'label'],
    },
    size: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'body-lg', 'body-md', 'body-sm', 'small'],
    },
    weight: {
      control: 'select',
      options: ['light', 'normal', 'medium', 'semibold', 'bold'],
    },
    tracking: {
      control: 'select',
      options: ['tight', 'comfortable', 'relaxed', 'wide'],
    },
    color: {
      control: 'select',
      options: ['default', 'muted', 'subtle'],
    },
    truncate: { control: 'boolean' },
    uppercase: { control: 'boolean' },
  },
}

export default textMeta
type TextStory = StoryObj<typeof Text>

export const Default: TextStory = {
  args: { children: 'The quick brown fox jumps over the lazy dog.' },
}

export const Playground: TextStory = {
  args: {
    as: 'p',
    size: 'body-md',
    weight: 'normal',
    tracking: 'comfortable',
    color: 'default',
    children: 'Fully configurable via controls below.',
  },
}

// ─── Type scale showcase ─────────────────────────────────────────────────────

export const TypeScale: TextStory = {
  name: 'Type Scale',
  render: () => (
    <div className="space-y-4">
      <Text size="h1" weight="semibold" tracking="tight">
        H1 — 2.25rem / 36px
      </Text>
      <Text size="h2" weight="semibold" tracking="tight">
        H2 — 1.875rem / 30px
      </Text>
      <Text size="h3" weight="semibold" tracking="tight">
        H3 — 1.5rem / 24px
      </Text>
      <Text size="h4" weight="semibold" tracking="tight">
        H4 — 1.25rem / 20px
      </Text>
      <Text size="h5" weight="medium">
        H5 — 1.125rem / 18px
      </Text>
      <hr className="border-border" />
      <Text size="body-lg">Body LG — 1.125rem / 18px. For introductory or featured copy.</Text>
      <Text size="body-md">Body MD — 1rem / 16px. The default reading size for most content.</Text>
      <Text size="body-sm">
        Body SM — 0.875rem / 14px. Secondary information and supporting text.
      </Text>
      <Text size="small" color="muted">
        Small — 0.75rem / 12px. Fine print, captions, and metadata.
      </Text>
    </div>
  ),
}

// ─── Font weights ─────────────────────────────────────────────────────────────

export const FontWeights: TextStory = {
  name: 'Font Weights',
  render: () => (
    <div className="space-y-3">
      {(['light', 'normal', 'medium', 'semibold', 'bold'] as const).map((w) => (
        <Text key={w} size="h4" weight={w}>
          {w.charAt(0).toUpperCase() + w.slice(1)} — The quick brown fox
        </Text>
      ))}
    </div>
  ),
}

// ─── Letter spacing ───────────────────────────────────────────────────────────

export const LetterSpacing: TextStory = {
  name: 'Letter Spacing',
  render: () => (
    <div className="space-y-4">
      <div>
        <Label>tight — headings &amp; hero text</Label>
        <Text size="h3" weight="semibold" tracking="tight">
          Tight: Vinyl Records & Music
        </Text>
      </div>
      <div>
        <Label>comfortable — neutral default</Label>
        <Text size="h3" weight="semibold" tracking="comfortable">
          Comfortable: Vinyl Records & Music
        </Text>
      </div>
      <div>
        <Label>relaxed — body copy</Label>
        <Text size="body-md" tracking="relaxed">
          Relaxed: A curated selection of rare and classic vinyl releases for collectors and
          enthusiasts.
        </Text>
      </div>
      <div>
        <Label>wide — labels &amp; eyebrows</Label>
        <Text size="small" weight="medium" tracking="wide" uppercase color="muted">
          Wide: New Arrivals
        </Text>
      </div>
    </div>
  ),
}

// ─── Color variants ───────────────────────────────────────────────────────────

export const Colors: TextStory = {
  name: 'Color Variants',
  render: () => (
    <div className="space-y-2">
      <Text color="default">Default — primary foreground</Text>
      <Text color="muted">Muted — secondary information</Text>
      <Text color="subtle">Subtle — de-emphasized content</Text>
    </div>
  ),
}

// ─── Render size decoupled from element ──────────────────────────────────────

export const SemanticDecoupling: TextStory = {
  name: 'Semantic Decoupling',
  render: () => (
    <div className="space-y-4">
      <div>
        <Label>h1 element → h3 visual size</Label>
        <Text as="h1" size="h3" weight="semibold" tracking="tight">
          Page title rendered at section scale
        </Text>
      </div>
      <div>
        <Label>h3 element → h1 visual size</Label>
        <Text as="h3" size="h1" weight="bold" tracking="tight">
          Section rendered at hero scale
        </Text>
      </div>
    </div>
  ),
}

// ─── Truncation ───────────────────────────────────────────────────────────────

export const Truncation: TextStory = {
  name: 'Truncation',
  render: () => (
    <div className="max-w-sm space-y-4">
      <div>
        <Label>truncate (single line)</Label>
        <Text truncate>
          Caetano Veloso — Transa — A groundbreaking Brazilian rock album from 1972 recorded in
          London
        </Text>
      </div>
      <div>
        <Label>lines=2 (line-clamp)</Label>
        <Text lines={2}>
          A curated selection of rare and classic vinyl releases. Browse our catalog of jazz, soul,
          funk, rock, and electronic music from the golden era of vinyl manufacturing through to
          modern pressings.
        </Text>
      </div>
    </div>
  ),
}

// ─── Named wrappers ───────────────────────────────────────────────────────────

export const HeadingWrappers: TextStory = {
  name: 'Heading Wrappers (H1–H5)',
  render: () => (
    <div className="space-y-4">
      <H1>H1 Wrapper — responsive page title</H1>
      <H2>H2 Wrapper — responsive section heading</H2>
      <H3>H3 Wrapper — responsive sub-section</H3>
      <H4>H4 Wrapper — card / list heading</H4>
      <H5>H5 Wrapper — inline label heading</H5>
    </div>
  ),
}

export const BodyWrappers: TextStory = {
  name: 'Body Wrappers (P, Small, Label)',
  render: () => (
    <div className="space-y-4">
      <div>
        <Label>P default (body-md)</Label>
        <P>The quick brown fox jumps over the lazy dog. Default body paragraph copy.</P>
      </div>
      <div>
        <Label>P size=body-lg</Label>
        <P size="body-lg">Larger intro paragraph for lead-in copy or featured text.</P>
      </div>
      <div>
        <Label>P size=body-sm</Label>
        <P size="body-sm">Smaller body copy for secondary content and supporting information.</P>
      </div>
      <div>
        <Label>Small (caption)</Label>
        <Small>Last updated 3 days ago · Discogs ID 12345</Small>
      </div>
      <div>
        <Label>Label (eyebrow)</Label>
        <Label>New Arrivals</Label>
      </div>
    </div>
  ),
}

// ─── Prose wrapper ────────────────────────────────────────────────────────────

export const ProseWrapper: TextStory = {
  name: 'Prose (long-form)',
  render: () => (
    <div className="max-w-prose">
      <Prose>
        <h1>Miles Davis — Kind of Blue</h1>
        <p>
          <em>Kind of Blue</em> is a studio album by American jazz musician Miles Davis. It was
          recorded on March 2 and April 22, 1959, at Columbia&apos;s 30th Street Studio in New York
          City.
        </p>
        <h2>Background</h2>
        <p>
          The album is the best-selling jazz record of all time. Davis led a sextet featuring John
          Coltrane, Cannonball Adderley, Bill Evans, Wynton Kelly, Paul Chambers, and Jimmy Cobb.
        </p>
        <h3>Modal Jazz</h3>
        <p>
          Rather than chord changes, Davis built compositions on <strong>modes</strong> — scales
          that gave musicians more freedom to improvise. The approach became one of the most
          influential innovations in jazz history.
        </p>
        <ul>
          <li>So What</li>
          <li>Freddie Freeloader</li>
          <li>Blue in Green</li>
          <li>All Blues</li>
          <li>Flamenco Sketches</li>
        </ul>
        <blockquote>There are no mistakes on the bandstand — Miles Davis</blockquote>
        <p>
          Press the <code>play</code> button to start listening.
        </p>
      </Prose>
    </div>
  ),
}
