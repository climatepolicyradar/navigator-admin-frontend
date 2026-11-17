import { screen } from '@testing-library/react'
import { setupUser } from '@/tests/helpers'
import {
  expectRedirectedToDashboard,
  renderApp,
} from '@/tests/utilsTest/renderApp'

describe('Corpus type page access', () => {
  afterEach(() => setupUser())

  it('is shown to superusers', async () => {
    setupUser({ isSuperuser: true })
    renderApp('/corpus-type/new')

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Create new corpus type',
      }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe('/corpus-type/new')
  })

  it('redirects non-superusers to the dashboard', async () => {
    setupUser({ isSuperuser: false })
    renderApp('/corpus-type/new')

    await expectRedirectedToDashboard()
    expect(
      screen.queryByRole('heading', { name: 'Create new corpus type' }),
    ).not.toBeInTheDocument()
  })
})
