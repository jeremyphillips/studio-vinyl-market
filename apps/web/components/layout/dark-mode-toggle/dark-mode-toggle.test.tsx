import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it} from 'vitest'
import {axe} from 'vitest-axe'

import {DarkModeToggle} from './dark-mode-toggle.client'

import {useThemeStore} from '@/stores/theme-store'


afterEach(() => {
  useThemeStore.setState({isDark: false})
})

describe('DarkModeToggle', () => {
  it('renders a switch with the correct role', () => {
    render(<DarkModeToggle />)

    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  describe('light mode (isDark: false)', () => {
    it('has aria-checked="false"', () => {
      render(<DarkModeToggle />)

      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
    })

    it('labels the switch "Switch to dark mode"', () => {
      render(<DarkModeToggle />)

      expect(screen.getByRole('switch', {name: 'Switch to dark mode'})).toBeInTheDocument()
    })
  })

  describe('dark mode (isDark: true)', () => {
    it('has aria-checked="true"', () => {
      useThemeStore.setState({isDark: true})
      render(<DarkModeToggle />)

      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
    })

    it('labels the switch "Switch to light mode"', () => {
      useThemeStore.setState({isDark: true})
      render(<DarkModeToggle />)

      expect(screen.getByRole('switch', {name: 'Switch to light mode'})).toBeInTheDocument()
    })
  })

  it('toggles dark mode when clicked', async () => {
    const user = userEvent.setup()
    render(<DarkModeToggle />)

    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'false')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'true')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })

  it('has no accessibility violations in light mode', async () => {
    const {container} = render(<DarkModeToggle />)

    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no accessibility violations in dark mode', async () => {
    useThemeStore.setState({isDark: true})
    const {container} = render(<DarkModeToggle />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
