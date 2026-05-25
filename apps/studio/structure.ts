import type {StructureResolver} from 'sanity/structure'
import {SITE_SETTINGS_ID} from './schemaTypes/siteSettings'

const SINGLETON_TYPES = new Set<string>(['siteSettings'])

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
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_TYPES.has(item.getId() ?? ''),
      ),
    ])
