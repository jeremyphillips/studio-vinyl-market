import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'

import {notFoundMessages} from './not-found-messages'
import {NotFoundView} from './not-found-view'
import {expectCatalogueEscapeLinks} from './test-utils'

describe('notFoundMessages', () => {
  it.each(Object.entries(notFoundMessages))(
    '%s message renders expected heading and links',
    (_key, message) => {
      render(<NotFoundView message={message} />)

      expect(screen.getByRole('heading', {level: 1})).toHaveTextContent(message.title)
      expect(screen.getByText(message.description)).toBeInTheDocument()
      expectCatalogueEscapeLinks(message.browseLabel, message.browseHref)
    },
  )
})
