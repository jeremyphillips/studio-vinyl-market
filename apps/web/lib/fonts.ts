import { Geist, Geist_Mono } from 'next/font/google'

export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

/** All font variable classNames joined for the `<html>` element. */
export const fontVariables = `${geistSans.variable} ${geistMono.variable}`
