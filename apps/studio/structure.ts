import type {StructureResolver} from 'sanity/structure'
import {RELEASES_PAGE_ID} from './schemaTypes/releasesPage'
import {SITE_SETTINGS_ID} from './schemaTypes/siteSettings'

const SINGLETON_TYPES = new Set<string>(['siteSettings', 'releasesPage'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .id(SITE_SETTINGS_ID)
        .title('Site settings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId(SITE_SETTINGS_ID)
            .title('Site settings'),
        ),
      S.listItem()
        .id(RELEASES_PAGE_ID)
        .title('Releases page')
        .child(
          S.document()
            .schemaType('releasesPage')
            .documentId(RELEASES_PAGE_ID)
            .title('Releases page'),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_TYPES.has(item.getId() ?? ''),
      ),
    ])
