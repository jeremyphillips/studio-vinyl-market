import { CoverImage } from '@/components/catalog/cover-image/cover-image'
import {
  LocationList,
  type LocationListItem,
} from '@/components/catalog/location-list/location-list'
import { H1, Label, P } from '@/components/ui/typography'
import type { ImageWithAltSource } from '@/sanity/image'

type IdentityProps = {
  /** Eyebrow label above the name, e.g. "Artist" or "Label". */
  eyebrow: string
  name: string
  cover?: ImageWithAltSource
  /** Alt text for the cover image — pages supply the appropriate noun. */
  coverAlt: string
  releaseCount: number
  locations?: LocationListItem[] | null
}

/**
 * Identity header shared by the artist and label detail pages: cover image,
 * eyebrow, name, release count, and an optional list of associated locations.
 */
export function Identity({
  eyebrow,
  name,
  cover,
  coverAlt,
  releaseCount,
  locations,
}: IdentityProps) {
  return (
    <header className="grid gap-6 md:grid-cols-[180px_1fr] md:items-end">
      {cover && <CoverImage source={cover} size={360} alt={coverAlt} className="md:size-44" />}
      <div className="space-y-2">
        <Label>{eyebrow}</Label>
        <H1>{name}</H1>
        <P color="muted">
          {releaseCount} {releaseCount === 1 ? 'release' : 'releases'}
        </P>
        {locations && locations.length > 0 && (
          <LocationList locations={locations} className="pt-1" />
        )}
      </div>
    </header>
  )
}
