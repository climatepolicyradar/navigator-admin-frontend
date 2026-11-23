import { screen } from '@testing-library/react'
import { setupUser } from '@/tests/helpers'
import { renderApp } from '@/tests/utilsTest/renderApp'

describe.each([
  {
    page: 'create',
    path: '/corpus-type/new',
    heading: 'Create new corpus type',
  },
  {
    page: 'edit',
    path: '/corpus-type/Laws and Policies/edit',
    heading: 'Editing: Laws and Policies',
  },
])('Corpus type page access ($page)', ({ path, heading }) => {
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
