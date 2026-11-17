import { screen } from '@testing-library/react'
import { setupUser } from '@/tests/helpers'
import {
  expectRedirectedToDashboard,
  renderApp,
} from '@/tests/utilsTest/renderApp'

describe('Corpora page access', () => {
  afterEach(() => setupUser())

  it('is shown to superusers', async () => {
    setupUser({ isSuperuser: true })
    renderApp('/corpora')

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Corpora',
      }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe('/corpora')
  })

  it('redirects non-superusers to the dashboard', async () => {
    setupUser({ isSuperuser: false })
    renderApp('/corpora')

    await expectRedirectedToDashboard()
    expect(
      screen.queryByRole('heading', { name: 'Corpora' }),
    ).not.toBeInTheDocument()
  })
})
