import {discogsMasterUrl, discogsReleaseUrl} from '@/lib/discogs'

import {H2} from '@/components/ui/typography'

type DiscogsMetaProps = {
  releaseId?: number | null
  masterId?: number | null
}

export function DiscogsMeta({releaseId, masterId}: DiscogsMetaProps) {
  if (!releaseId) return null

  return (
    <section aria-labelledby="discogs-heading" className="space-y-3">
      <H2 id="discogs-heading" size="h5">
        Discogs
      </H2>
      <dl className="grid grid-cols-2 gap-y-3 text-sm">
        <dt className="text-muted-foreground">Release</dt>
        <dd>
          <a
            href={discogsReleaseUrl(releaseId)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:underline"
          >
            {releaseId}
          </a>
        </dd>

        {masterId != null && (
          <>
            <dt className="text-muted-foreground">Master</dt>
            <dd>
              <a
                href={discogsMasterUrl(masterId)}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {masterId}
              </a>
            </dd>
          </>
        )}
      </dl>
    </section>
  )
}
