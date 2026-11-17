import { screen } from '@testing-library/react'
import { setupUser } from '@/tests/helpers'
import {
  expectRedirectedToDashboard,
  renderApp,
} from '@/tests/utilsTest/renderApp'

describe('User page access', () => {
  afterEach(() => setupUser())

  it('is shown to superusers', async () => {
    setupUser({ isSuperuser: true })
    renderApp('/user/test.user@navigator.com')

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Editing: test.user@navigator.com',
      }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe('/user/test.user@navigator.com')
  })

  it('redirects non-superusers to the dashboard', async () => {
    setupUser({ isSuperuser: false })
    renderApp('/user/test.user@navigator.com')

    await expectRedirectedToDashboard()
    expect(
      screen.queryByRole('heading', {
        name: 'Editing: test.user@navigator.com',
      }),
    ).not.toBeInTheDocument()
  })
})
