import {artist} from './artist'
import {label} from './label'
import {imageWithAlt} from './objects/imageWithAlt'
import {navItem} from './objects/navItem'
import {seo} from './objects/seo'
import {release} from './release'
import {releasesPage} from './releasesPage'
import {siteSettings} from './siteSettings'

export const schemaTypes = [
  imageWithAlt,
  seo,
  navItem,
  artist,
  label,
  release,
  releasesPage,
  siteSettings,
]
