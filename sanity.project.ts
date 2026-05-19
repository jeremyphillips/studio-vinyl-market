function requiredEnv(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env or set it in your environment.`,
    )
  }
  return value
}

export function getSanityApiConfig() {
  return {
    projectId: requiredEnv('SANITY_STUDIO_PROJECT_ID'),
    dataset: requiredEnv('SANITY_STUDIO_DATASET'),
  }
}
