import type {PreviewProps} from 'sanity'

type BlockPreviewProps = PreviewProps & {
  blockName: string
}

export function BlockPreview({blockName, renderDefault, ...props}: BlockPreviewProps) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--card-muted-fg-color)',
          padding: '4px 8px 0',
        }}
      >
        {blockName}
      </div>
      {renderDefault(props as PreviewProps)}
    </div>
  )
}
