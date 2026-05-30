function requiredEnv(name: string, value: string | undefined): string {
  const trimmed = value?.trim()
  if (!trimmed) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to apps/studio/.env or set it in your environment.`,
    )
  }
  return trimmed
}

function optionalEnv(value: string | undefined, fallback: string): string {
  return value?.trim() || fallback
}

export function getSanityApiConfig() {
  return {
    projectId: requiredEnv('SANITY_STUDIO_PROJECT_ID', process.env.SANITY_STUDIO_PROJECT_ID),
    dataset: requiredEnv('SANITY_STUDIO_DATASET', process.env.SANITY_STUDIO_DATASET),
  }
}

export function getSanityPreviewUrl(): string {
  return optionalEnv(process.env.SANITY_STUDIO_PREVIEW_URL, 'http://localhost:3000')
}
