import { screen } from '@testing-library/react'
import { setupUser } from '@/tests/helpers'
import {
  expectRedirectedToDashboard,
  renderApp,
} from '@/tests/utilsTest/renderApp'

describe('Users page access', () => {
  afterEach(() => setupUser())

  it('is shown to superusers', async () => {
    setupUser({ isSuperuser: true })
    renderApp('/users')

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Users',
      }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe('/users')
  })

  it('redirects non-superusers to the dashboard', async () => {
    setupUser({ isSuperuser: false })
    renderApp('/users')

    await expectRedirectedToDashboard()
    expect(
      screen.queryByRole('heading', { name: 'Users' }),
    ).not.toBeInTheDocument()
  })
})
