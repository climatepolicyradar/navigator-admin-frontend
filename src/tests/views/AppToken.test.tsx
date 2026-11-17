import { screen } from '@testing-library/react'
import { setupUser } from '@/tests/helpers'
import {
  expectRedirectedToDashboard,
  renderApp,
} from '@/tests/utilsTest/renderApp'

describe('App token page access', () => {
  afterEach(() => setupUser())

  it('is shown to superusers', async () => {
    setupUser({ isSuperuser: true })
    renderApp('/app-tokens/new')

    // The page has no heading, so checking submit button instead.
    expect(
      await screen.findByRole('button', { name: 'Create new App Token' }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe('/app-tokens/new')
  })

  it('redirects non-superusers to the dashboard', async () => {
    setupUser({ isSuperuser: false })
    renderApp('/app-tokens/new')

    await expectRedirectedToDashboard()
    expect(
      screen.queryByRole('button', { name: 'Create new App Token' }),
    ).not.toBeInTheDocument()
  })
})
