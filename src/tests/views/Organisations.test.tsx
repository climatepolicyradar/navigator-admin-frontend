import { screen } from '@testing-library/react'
import { setupUser } from '@/tests/helpers'
import {
  expectRedirectedToDashboard,
  renderApp,
} from '@/tests/utilsTest/renderApp'

describe('Organisations page access', () => {
  afterEach(() => setupUser())

  it('is shown to superusers', async () => {
    setupUser({ isSuperuser: true })
    renderApp('/organisations')

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Organisations',
      }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe('/organisations')
  })

  it('redirects non-superusers to the dashboard', async () => {
    setupUser({ isSuperuser: false })
    renderApp('/organisations')

    await expectRedirectedToDashboard()
    expect(
      screen.queryByRole('heading', { name: 'Organisations' }),
    ).not.toBeInTheDocument()
  })
})
