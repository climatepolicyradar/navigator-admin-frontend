import { screen } from '@testing-library/react'
import { setupUser } from '@/tests/helpers'
import { renderApp } from '@/tests/utilsTest/renderApp'

describe.each([
  { page: 'create', path: '/corpus/new', heading: 'Create new corpus' },
  {
    page: 'edit',
    path: '/corpus/CCLW.corpus.1.0/edit',
    heading: 'Editing: Test Corpus 1',
  },
])('Corpus page access ($page)', ({ path, heading }) => {
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
