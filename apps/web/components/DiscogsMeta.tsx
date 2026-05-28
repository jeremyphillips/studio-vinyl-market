type DiscogsMetaProps = {
  releaseId?: number | null
  masterId?: number | null
}

export function DiscogsMeta({releaseId, masterId}: DiscogsMetaProps) {
  if (!releaseId) return null

  return (
    <section aria-labelledby="discogs-heading" className="space-y-3">
      <h2 id="discogs-heading" className="text-lg font-semibold">
        Discogs
      </h2>
      <dl className="grid grid-cols-2 gap-y-3 text-sm">
        <dt className="text-muted-foreground">Release</dt>
        <dd>
          <a
            href={`https://www.discogs.com/release/${releaseId}`}
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
                href={`https://www.discogs.com/master/${masterId}`}
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
