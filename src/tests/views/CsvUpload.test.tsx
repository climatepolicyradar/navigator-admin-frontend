import { screen } from '@testing-library/react'
import { setupUser } from '@/tests/helpers'
import { renderApp } from '@/tests/utilsTest/renderApp'

describe('CSV upload page access', () => {
  it('is shown to superusers', async () => {
    setupUser({ isSuperuser: true })
    renderApp('/csv-upload')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'CSV Upload' }),
    ).toBeInTheDocument()
  })

  it('redirects non-superusers to the dashboard', async () => {
    setupUser({ isSuperuser: false })
    renderApp('/csv-upload')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Dashboard' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 1, name: 'CSV Upload' }),
    ).not.toBeInTheDocument()
  })
})
