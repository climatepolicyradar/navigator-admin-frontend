import { screen } from '@testing-library/react'
import { setupUser } from '@/tests/helpers'
import { renderApp } from '@/tests/utilsTest/renderApp'

describe('Organisations page access', () => {
  it('is shown to superusers', async () => {
    setupUser({ isSuperuser: true })
    renderApp('/organisations')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Organisations' }),
    ).toBeInTheDocument()
  })

  it('redirects non-superusers to the dashboard', async () => {
    setupUser({ isSuperuser: false })
    renderApp('/organisations')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Dashboard' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 1, name: 'Organisations' }),
    ).not.toBeInTheDocument()
  })
})
