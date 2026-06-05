import {
  ReleaseCard,
  type ReleaseData,
} from '@/components/catalog/release-card/release-card.client'
import { P } from '@/components/ui/typography'

export type ReleaseGridProps = {
  releases: Array<ReleaseData & { _id: string }>
  /** Shown when the releases array is empty. Defaults to `'No releases yet.'` */
  emptyMessage?: string
  /**
   * Number of leading cards to receive `priority={true}`, hinting the browser to
   * preload those images for LCP. Pass `4` on pages where the first full row of a
   * 4-column grid is above the fold (e.g. homepage). Defaults to `1`.
   */
  priorityCount?: number
}

export function ReleaseGrid({
  releases,
  emptyMessage = 'No releases yet.',
  priorityCount = 1,
}: ReleaseGridProps) {
  if (releases.length === 0) {
    return <P color="muted">{emptyMessage}</P>
  }

  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {releases.map((release, index) => (
        <li key={release._id}>
          <ReleaseCard release={release} priority={index < priorityCount} />
        </li>
      ))}
    </ul>
  )
}
