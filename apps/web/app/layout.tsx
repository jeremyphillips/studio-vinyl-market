import type { Metadata } from 'next'
import { cookies, draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'

import { Header } from '@/components/layout/header/header'
import { DisableDraftMode } from '@/components/preview/disable-draft-mode/disable-draft-mode.client'
import { fontVariables } from '@/lib/fonts'
import { SanityLive } from '@/sanity/live'

import '../styles/globals.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'Vinyl Market',
    template: '%s · Vinyl Market',
  },
  description: 'A small marketplace for vinyl releases.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [{ isEnabled: isDraftMode }, cookieStore] = await Promise.all([draftMode(), cookies()])

  const isDark = cookieStore.get('theme')?.value === 'dark'

  return (
    <html lang="en" className={`${fontVariables} ${isDark ? 'dark' : ''}`}>
      <body className="min-h-screen font-sans antialiased">
        <Header initialIsDark={isDark} />
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
