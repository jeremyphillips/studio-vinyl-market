import { Button, Flex } from '@sanity/ui'
import { LinkedIdCard, type LinkedIdItem } from '../ui'
import { DiscogsImportPanel } from './DiscogsImportPanel'

export interface LinkedReleaseViewProps {
  items: LinkedIdItem[]
  releaseId: number
  onSearchAgain: () => void
  onClear: () => void
}

/**
 * The linked-state view: the external Discogs links, the field import panel,
 * and the controls to search again or clear the link.
 */
export function LinkedReleaseView({
  items,
  releaseId,
  onSearchAgain,
  onClear,
}: LinkedReleaseViewProps) {
  return (
    <>
      <LinkedIdCard title="Linked Discogs release" items={items} />
      <DiscogsImportPanel releaseId={releaseId} />
      <Flex gap={2}>
        <Button mode="ghost" text="Search again" onClick={onSearchAgain} />
        <Button mode="ghost" tone="critical" text="Clear" onClick={onClear} />
      </Flex>
    </>
  )
}
