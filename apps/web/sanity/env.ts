function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to apps/web/.env.local and fill it in.`,
    )
  }
  return value
}

export const projectId = required(
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
)

export const dataset = required(
  'NEXT_PUBLIC_SANITY_DATASET',
  process.env.NEXT_PUBLIC_SANITY_DATASET,
)

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || '2026-01-01'

export const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL?.trim() || 'http://localhost:3333'

/**
 * Server-only viewer token, used by `defineLive` to query drafts during draft
 * mode. Must never be exposed to the client bundle (no `NEXT_PUBLIC_` prefix).
 */
export const readToken = process.env.SANITY_API_READ_TOKEN
