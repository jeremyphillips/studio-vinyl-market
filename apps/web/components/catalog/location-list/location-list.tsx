import { MapPin } from 'lucide-react'

import { cn } from '@/lib/utils'

export type LocationListItem = {
  city: string | null
  state: string | null
  country: string | null
}

type LocationListProps = {
  locations: LocationListItem[]
  className?: string
}

/**
 * Renders a list of places as `City, State, Country` rows with a location icon.
 * Empty parts are omitted; rows that resolve to an empty string are skipped, and
 * the component renders nothing when no location has any value.
 */
export function LocationList({ locations, className }: LocationListProps) {
  const rows = locations
    .map(({ city, state, country }) => [city, state, country].filter(Boolean).join(', '))
    .filter((label) => label.length > 0)

  if (rows.length === 0) return null

  return (
    <ul className={cn('space-y-1', className)}>
      {rows.map((label, index) => (
        <li
          key={`${label}-${index}`}
          className="text-muted-foreground flex items-center gap-1.5 text-sm"
        >
          <MapPin aria-hidden className="size-4 shrink-0" />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  )
}
