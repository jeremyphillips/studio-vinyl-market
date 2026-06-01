import {Label, P} from '@/components/ui/typography'

type Disc = {
  _key: string
  discNumber: number
  name?: string | null
  tracks?: Array<{_key: string; position: string; title: string}> | null
}

type TracklistProps = {
  discs?: Disc[] | null
}

export function Tracklist({discs}: TracklistProps) {
  if (!discs || discs.length === 0) {
    return (
      <P size="body-sm" color="muted">No tracklist yet.</P>
    )
  }

  return (
    <div className="space-y-6">
      {discs.map((disc) => {
        const heading = disc.name?.trim() || `Disc ${disc.discNumber}`
        const tracks = disc.tracks ?? []
        return (
          <section key={disc._key} aria-label={heading}>
            <Label as="small" className="mb-2">
              {heading}
            </Label>
            {tracks.length === 0 ? (
              <P size="body-sm" color="muted">No tracks yet.</P>
            ) : (
              <ol className="divide-y rounded-md border">
                {tracks.map((track) => (
                  <li
                    key={track._key}
                    className="flex items-baseline gap-3 px-3 py-2 text-sm"
                  >
                    <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">
                      {track.position}
                    </span>
                    <span>{track.title}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        )
      })}
    </div>
  )
}
