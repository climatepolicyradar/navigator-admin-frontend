import { screen } from '@testing-library/react'
import { setupUser } from '@/tests/helpers'
import { renderApp } from '@/tests/utilsTest/renderApp'

describe('App token page access', () => {
  it('is shown to superusers', async () => {
    setupUser({ isSuperuser: true })
    renderApp('/app-tokens/new')

    // The page has no heading, so checking submit button instead.
    expect(
      await screen.findByRole('button', { name: 'Create new App Token' }),
    ).toBeInTheDocument()
  })

  it('redirects non-superusers to the dashboard', async () => {
    setupUser({ isSuperuser: false })
    renderApp('/app-tokens/new')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Dashboard' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Create new App Token' }),
    ).not.toBeInTheDocument()
  })
})
