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
  // TypeGen (`sanity schema extract` + `sanity typegen generate`) reads the
  // local schema, never the remote dataset, so the projectId/dataset values are
  // irrelevant to the generated types — they only exist to satisfy config
  // validation. The typegen script sets SANITY_TYPEGEN so CI (and a fresh
  // checkout without .env) can generate types without real credentials, while
  // `sanity dev`/deploy still fail loudly when the env is missing.
  if (process.env.SANITY_TYPEGEN) {
    return {
      projectId: optionalEnv(process.env.SANITY_STUDIO_PROJECT_ID, 'typegen'),
      dataset: optionalEnv(process.env.SANITY_STUDIO_DATASET, 'typegen'),
    }
  }

  return {
    projectId: requiredEnv('SANITY_STUDIO_PROJECT_ID', process.env.SANITY_STUDIO_PROJECT_ID),
    dataset: requiredEnv('SANITY_STUDIO_DATASET', process.env.SANITY_STUDIO_DATASET),
  }
}

export function getSanityPreviewUrl(): string {
  return optionalEnv(process.env.SANITY_STUDIO_PREVIEW_URL, 'http://localhost:3000')
}
