'use client'

import { useIsPresentationTool } from 'next-sanity/hooks'

/**
 * Floating "Exit preview" button shown only when draft mode is on AND we're
 * not inside the Presentation Tool's iframe (Presentation has its own exit
 * button in the toolbar).
 */
export function DisableDraftMode() {
  const isPresentation = useIsPresentationTool()
  if (isPresentation) return null

  return (
    <a
      href="/api/draft-mode/disable"
      className="bg-background hover:bg-accent fixed right-4 bottom-4 rounded-md border px-4 py-2 text-sm shadow-md"
    >
      Exit preview
    </a>
  )
}
