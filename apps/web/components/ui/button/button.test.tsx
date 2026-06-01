import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {axe} from 'vitest-axe'

import {Button} from './button.client'

describe('Button', () => {
  it('renders with a visible label', () => {
    render(<Button>Add to cart</Button>)

    expect(screen.getByRole('button', {name: 'Add to cart'})).toBeInTheDocument()
  })

  it.each(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const)(
    'renders variant "%s" as an accessible button',
    (variant) => {
      render(<Button variant={variant}>Action</Button>)

      expect(screen.getByRole('button', {name: 'Action'})).toBeInTheDocument()
    },
  )

  it.each(['default', 'sm', 'lg', 'icon'] as const)('renders size "%s"', (size) => {
    render(<Button size={size}>Go</Button>)

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders as an anchor when asChild is used with an <a> element', () => {
    render(
      <Button asChild>
        <a href="/catalogue">Browse catalogue</a>
      </Button>,
    )

    const link = screen.getByRole('link', {name: 'Browse catalogue'})
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/catalogue')
  })

  it('is disabled when the disabled prop is set', () => {
    render(<Button disabled>Unavailable</Button>)

    expect(screen.getByRole('button', {name: 'Unavailable'})).toBeDisabled()
  })

  it('calls the onClick handler when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Click me</Button>)
    await user.click(screen.getByRole('button', {name: 'Click me'}))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    )
    await user.click(screen.getByRole('button', {name: 'Disabled'}))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('has no accessibility violations', async () => {
    const {container} = render(<Button>Submit</Button>)

    expect(await axe(container)).toHaveNoViolations()
  })
})
