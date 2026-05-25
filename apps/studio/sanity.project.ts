function requiredEnv(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to apps/studio/.env or set it in your environment.`,
    )
  }
  return value
}

function optionalEnv(name: string, fallback: string): string {
  return process.env[name]?.trim() || fallback
}

export function getSanityApiConfig() {
  return {
    projectId: requiredEnv('SANITY_STUDIO_PROJECT_ID'),
    dataset: requiredEnv('SANITY_STUDIO_DATASET'),
  }
}

export function getSanityPreviewUrl(): string {
  return optionalEnv('SANITY_STUDIO_PREVIEW_URL', 'http://localhost:3000')
}
