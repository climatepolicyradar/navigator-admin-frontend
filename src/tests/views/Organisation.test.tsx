import { screen } from '@testing-library/react'
import { setupUser } from '@/tests/helpers'
import {
  expectRedirectedToDashboard,
  renderApp,
} from '@/tests/utilsTest/renderApp'

describe('Organisation page access', () => {
  afterEach(() => setupUser())

  it('is shown to superusers', async () => {
    setupUser({ isSuperuser: true })
    renderApp('/organisation/new')

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Create new organisation',
      }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe('/organisation/new')
  })

  it('redirects non-superusers to the dashboard', async () => {
    setupUser({ isSuperuser: false })
    renderApp('/organisation/new')

    await expectRedirectedToDashboard()
    expect(
      screen.queryByRole('heading', { name: 'Create new organisation' }),
    ).not.toBeInTheDocument()
  })
})
