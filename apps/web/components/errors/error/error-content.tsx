'use client'

import { useEffect } from 'react'

import { CatalogueEscapeLinks } from '@/components/errors/shared/catalogue-escape-links'
import { Button } from '@/components/ui/button'
import { H1, P, Small } from '@/components/ui/typography'

type ErrorContentProps = {
  error: Error & { digest?: string }
  reset: () => void
  title?: string
  description?: string
}

export function ErrorContent({
  error,
  reset,
  title = 'Something went wrong',
  description = 'We couldn’t load this page. Try again, or head back to the catalogue.',
}: ErrorContentProps) {
  const isDev = process.env.NODE_ENV === 'development'

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <P size="body-sm" weight="medium" color="muted">
          Error
        </P>
        <H1>{title}</H1>
        <P color="muted">{description}</P>
      </header>

      {isDev ? (
        <div className="border-destructive/30 bg-destructive/5 space-y-2 rounded-lg border p-4">
          <P size="body-sm" weight="medium" className="text-destructive">
            Development details
          </P>
          {error.digest ? <Small className="font-mono">Digest: {error.digest}</Small> : null}
          <pre className="text-foreground max-h-64 overflow-auto font-mono text-xs break-words whitespace-pre-wrap">
            {error.message}
            {error.stack ? `\n\n${error.stack}` : ''}
          </pre>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <CatalogueEscapeLinks homeVariant="outline" />
      </div>
    </div>
  )
}
