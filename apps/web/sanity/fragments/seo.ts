import {imageWithAltFields} from './image'

/** seo object projection for page singletons and CMS pages. */
export const seoProjection = /* groq */ `
  seo{
    metaTitle,
    metaDescription,
    noIndex,
    ogImage{${imageWithAltFields}}
  }
`
