import { useEffect, useState } from 'react'
import { useClient } from 'sanity'

export function useReferencedDocumentField(
  ref: string | undefined,
  field: string,
): string | undefined {
  const client = useClient({ apiVersion: '2026-01-01' })
  const [value, setValue] = useState<string | undefined>()

  useEffect(() => {
    if (!ref) {
      setValue(undefined)
      return
    }

    let cancelled = false

    client
      .fetch<string | null>(`*[_id == $id][0].${field}`, { id: ref })
      .then((result) => {
        if (!cancelled && result) setValue(result)
      })
      .catch(() => {
        // Ignore fetch errors for unresolved references
      })

    return () => {
      cancelled = true
    }
  }, [client, ref, field])

  return value
}
