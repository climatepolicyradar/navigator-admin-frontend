import { screen } from '@testing-library/react'
import { setupUser } from '@/tests/helpers'
import { renderApp } from '@/tests/utilsTest/renderApp'

describe('User page access', () => {
  it('is shown to superusers', async () => {
    setupUser({ isSuperuser: true })
    renderApp('/user/test.user@navigator.com')

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Editing: test.user@navigator.com',
      }),
    ).toBeInTheDocument()
  })

  it('redirects non-superusers to the dashboard', async () => {
    setupUser({ isSuperuser: false })
    renderApp('/user/test.user@navigator.com')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Dashboard' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', {
        level: 1,
        name: 'Editing: test.user@navigator.com',
      }),
    ).not.toBeInTheDocument()
  })
})
