/** locations[] item fields (array brackets/braces not included). */
export const locationFields = /* groq */ `
  city,
  state,
  country
`

/**
 * Full locations[] projection. Uses element-projection syntax (`[]{...}`) so
 * TypeGen resolves the per-item field types rather than `Array<never>`.
 */
export const locationsProjection = /* groq */ `[]{${locationFields}}`
