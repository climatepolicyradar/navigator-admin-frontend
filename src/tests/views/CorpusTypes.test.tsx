import { screen } from '@testing-library/react'
import { setupUser } from '@/tests/helpers'
import {
  expectRedirectedToDashboard,
  renderApp,
} from '@/tests/utilsTest/renderApp'

describe('Corpus types page access', () => {
  afterEach(() => setupUser())

  it('is shown to superusers', async () => {
    setupUser({ isSuperuser: true })
    renderApp('/corpus-types')

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Corpus Types',
      }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe('/corpus-types')
  })

  it('redirects non-superusers to the dashboard', async () => {
    setupUser({ isSuperuser: false })
    renderApp('/corpus-types')

    await expectRedirectedToDashboard()
    expect(
      screen.queryByRole('heading', { name: 'Corpus Types' }),
    ).not.toBeInTheDocument()
  })
})
