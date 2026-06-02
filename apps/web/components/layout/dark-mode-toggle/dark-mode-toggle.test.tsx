import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'

import { DarkModeToggle } from './dark-mode-toggle.client'

describe('DarkModeToggle', () => {
  it('renders a switch with the correct role', () => {
    render(<DarkModeToggle initialIsDark={false} />)

    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  describe('light mode (initialIsDark: false)', () => {
    it('has aria-checked="false"', () => {
      render(<DarkModeToggle initialIsDark={false} />)

      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
    })

    it('labels the switch "Switch to dark mode"', () => {
      render(<DarkModeToggle initialIsDark={false} />)

      expect(screen.getByRole('switch', { name: 'Switch to dark mode' })).toBeInTheDocument()
    })
  })

  describe('dark mode (initialIsDark: true)', () => {
    it('has aria-checked="true"', () => {
      render(<DarkModeToggle initialIsDark={true} />)

      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
    })

    it('labels the switch "Switch to light mode"', () => {
      render(<DarkModeToggle initialIsDark={true} />)

      expect(screen.getByRole('switch', { name: 'Switch to light mode' })).toBeInTheDocument()
    })
  })

  it('toggles dark mode when clicked', async () => {
    const user = userEvent.setup()
    render(<DarkModeToggle initialIsDark={false} />)

    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'false')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'true')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })

  it('has no accessibility violations in light mode', async () => {
    const { container } = render(<DarkModeToggle initialIsDark={false} />)

    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no accessibility violations in dark mode', async () => {
    const { container } = render(<DarkModeToggle initialIsDark={true} />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
