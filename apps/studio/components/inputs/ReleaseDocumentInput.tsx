import { useCallback } from 'react'
import { PatchEvent, set, type ObjectInputProps } from 'sanity'

type OnChangePatch = Parameters<ObjectInputProps['onChange']>[0]

/**
 * Document-level input wrapper for release documents.
 *
 * Intercepts field changes to apply contextual defaults:
 *   - mediaType → shellac  : classification=Single, speed=78, size=10"
 *   - mediaType → vinyl    : speed=33, size=12"
 *   - classification → LP  : speed=33, size=12"
 */
export function ReleaseDocumentInput(props: ObjectInputProps) {
  const { onChange, renderDefault } = props

  const handleChange = useCallback(
    (event: OnChangePatch) => {
      if (!(event instanceof PatchEvent)) {
        onChange(event)
        return
      }

      const extra: ReturnType<typeof set>[] = []

      for (const patch of event.patches) {
        if (patch.type !== 'set' || patch.path.length !== 1) continue

        const field = patch.path[0]
        if (typeof field !== 'string') continue

        if (field === 'mediaType') {
          if (patch.value === 'shellac') {
            extra.push(set('Single', ['classification']))
            extra.push(set('78', ['speed']))
            extra.push(set('10"', ['size']))
          } else if (patch.value === 'vinyl') {
            extra.push(set('33', ['speed']))
            extra.push(set('12"', ['size']))
          }
        }

        if (field === 'classification' && patch.value === 'LP') {
          extra.push(set('33', ['speed']))
          extra.push(set('12"', ['size']))
        }
      }

      onChange(extra.length > 0 ? PatchEvent.from([...event.patches, ...extra]) : event)
    },
    [onChange],
  )

  return renderDefault({ ...props, onChange: handleChange })
}
