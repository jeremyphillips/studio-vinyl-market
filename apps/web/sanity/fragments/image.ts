/** Fields for imageWithAlt — no wrapping braces. */
export const imageWithAltFields = /* groq */ `
  asset,
  hotspot,
  crop,
  alt
`

/** imageWithAlt projection, including braces. */
export const imageWithAlt = /* groq */ `{${imageWithAltFields}}`

/** imageWithAlt plus caption, including braces. */
export const imageWithAltCaption = /* groq */ `{${imageWithAltFields},
  caption}`

/** gallery[] item shape (array brackets not included). */
export const galleryItemFields = /* groq */ `
  _key,
  asset,
  hotspot,
  crop,
  alt,
  caption
`

/** Full gallery[] projection. */
export const galleryProjection = /* groq */ `[{${galleryItemFields}}]`
