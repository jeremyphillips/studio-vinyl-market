import { useEffect, useRef } from 'react'
import { getPublishedId, useDocumentOperation, useFormValue, type ObjectInputProps } from 'sanity'

/**
 * Document-level input wrapper for release documents.
 *
 * Uses useFormValue to watch trigger fields and applies contextual defaults via
 * patch.execute (same pattern as DiscogsImportPanel) when values change:
 *   - mediaType → shellac  : classification=Single, speed=78, size=10"
 *   - mediaType → vinyl    : speed=33, size=12"
 *   - classification → LP  : speed=33, size=12"
 */
export function ReleaseDocumentInput(props: ObjectInputProps) {
  const { renderDefault } = props

  const rawId = useFormValue(['_id']) as string | undefined
  const documentId = getPublishedId(rawId ?? '')
  const documentType = (useFormValue(['_type']) as string | undefined) ?? 'release'
  const mediaType = useFormValue(['mediaType']) as string | undefined
  const classification = useFormValue(['classification']) as string | undefined

  const { patch } = useDocumentOperation(documentId, documentType)

  // Track previous values so we only react to actual user-driven changes,
  // not the initial load.
  const prevMediaType = useRef<string | undefined>(undefined)
  const prevClassification = useRef<string | undefined>(undefined)
  const mediaTypeMounted = useRef(false)
  const classificationMounted = useRef(false)

  // fallow-ignore-next-line complexity
  useEffect(() => {
    if (!mediaTypeMounted.current) {
      mediaTypeMounted.current = true
      prevMediaType.current = mediaType
      return
    }
    if (mediaType === prevMediaType.current) return
    prevMediaType.current = mediaType

    if (mediaType === 'shellac') {
      patch.execute([{ set: { classification: 'Single', speed: '78', size: '10"' } }])
    } else if (mediaType === 'vinyl') {
      patch.execute([{ set: { speed: '33', size: '12"' } }])
    }
  }, [mediaType, patch])

  useEffect(() => {
    if (!classificationMounted.current) {
      classificationMounted.current = true
      prevClassification.current = classification
      return
    }
    if (classification === prevClassification.current) return
    prevClassification.current = classification

    if (classification === 'LP') {
      patch.execute([{ set: { speed: '33', size: '12"' } }])
    }
  }, [classification, patch])

  return renderDefault(props)
}
