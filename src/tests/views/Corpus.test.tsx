import { screen } from '@testing-library/react'
import { setupUser } from '@/tests/helpers'
import {
  expectRedirectedToDashboard,
  renderApp,
} from '@/tests/utilsTest/renderApp'

describe('Corpus page access', () => {
  afterEach(() => setupUser())

  it('is shown to superusers', async () => {
    setupUser({ isSuperuser: true })
    renderApp('/corpus/new')

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Create new corpus',
      }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe('/corpus/new')
  })

  it('redirects non-superusers to the dashboard', async () => {
    setupUser({ isSuperuser: false })
    renderApp('/corpus/new')

    await expectRedirectedToDashboard()
    expect(
      screen.queryByRole('heading', { name: 'Create new corpus' }),
    ).not.toBeInTheDocument()
  })
})
