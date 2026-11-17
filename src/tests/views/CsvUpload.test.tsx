import { screen } from '@testing-library/react'
import { setupUser } from '@/tests/helpers'
import {
  expectRedirectedToDashboard,
  renderApp,
} from '@/tests/utilsTest/renderApp'

describe('CSV upload page access', () => {
  afterEach(() => setupUser())

  it('is shown to superusers', async () => {
    setupUser({ isSuperuser: true })
    renderApp('/csv-upload')

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'CSV Upload',
      }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe('/csv-upload')
  })

  it('redirects non-superusers to the dashboard', async () => {
    setupUser({ isSuperuser: false })
    renderApp('/csv-upload')

    await expectRedirectedToDashboard()
    expect(
      screen.queryByRole('heading', { name: 'CSV Upload' }),
    ).not.toBeInTheDocument()
  })
})
