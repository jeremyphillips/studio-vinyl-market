import type { Metadata } from 'next'
import { draftMode } from 'next/headers'

export const dynamic = 'force-dynamic'
import { VisualEditing } from 'next-sanity/visual-editing'

import { DisableDraftMode } from '@/components/preview/disable-draft-mode/disable-draft-mode.client'
import { Header } from '@/components/layout/header/header'
import { SanityLive } from '@/sanity/live'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Vinyl Market',
    template: '%s · Vinyl Market',
  },
  description: 'A small marketplace for vinyl releases.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isEnabled: isDraftMode } = await draftMode()

  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Header />
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        <SanityLive />
        {isDraftMode && (
          <>
            <DisableDraftMode />
            <VisualEditing />
          </>
        )}
      </body>
    </html>
  )
}
