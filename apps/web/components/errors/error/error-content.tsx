'use client'

import {useEffect} from 'react'

import {Button} from '@/components/ui/button'
import {CatalogueEscapeLinks} from '@/components/errors/shared/catalogue-escape-links'

type ErrorContentProps = {
  error: Error & {digest?: string}
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
        <p className="text-sm font-medium text-muted-foreground">Error</p>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </header>

      {isDev ? (
        <div className="space-y-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">Development details</p>
          {error.digest ? (
            <p className="font-mono text-xs text-muted-foreground">
              Digest: {error.digest}
            </p>
          ) : null}
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words font-mono text-xs text-foreground">
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
