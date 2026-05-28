import {artist} from './artist'
import {label} from './label'
import {buttonBlock} from './objects/buttonBlock'
import {imageWithAlt} from './objects/imageWithAlt'
import {navItem} from './objects/navItem'
import {seo} from './objects/seo'
import {page} from './page'
import {release} from './release'
import {releasesPage} from './releasesPage'
import {siteSettings} from './siteSettings'

export const schemaTypes = [
  imageWithAlt,
  seo,
  navItem,
  buttonBlock,
  artist,
  label,
  page,
  release,
  releasesPage,
  siteSettings,
]
