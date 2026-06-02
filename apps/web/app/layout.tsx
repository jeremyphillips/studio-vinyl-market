import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { cookies, draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'

import { Header } from '@/components/layout/header/header'
import { DisableDraftMode } from '@/components/preview/disable-draft-mode/disable-draft-mode.client'
import { SanityLive } from '@/sanity/live'

import '../styles/globals.css'

export const dynamic = 'force-dynamic'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${isDark ? 'dark' : ''}`}
    >
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
