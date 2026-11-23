import { screen } from '@testing-library/react'
import { setupUser } from '@/tests/helpers'
import { renderApp } from '@/tests/utilsTest/renderApp'

describe.each([
  {
    page: 'create',
    path: '/organisation/new',
    heading: 'Create new organisation',
  },
  {
    page: 'edit',
    path: '/organisation/1/edit',
    heading: 'Editing: Test Organisation 1',
  },
])('Organisation page access ($page)', ({ path, heading }) => {
  it('is shown to superusers', async () => {
    setupUser({ isSuperuser: true })
    renderApp(path)

    expect(
      await screen.findByRole('heading', { level: 1, name: heading }),
    ).toBeInTheDocument()
  })

  it('redirects non-superusers to the dashboard', async () => {
    setupUser({ isSuperuser: false })
    renderApp(path)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Dashboard' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: heading }),
    ).not.toBeInTheDocument()
  })
})
