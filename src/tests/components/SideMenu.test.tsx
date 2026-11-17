import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { customRender } from '@/tests/utilsTest/render'
import { SideMenu } from '@/components/SideMenu'
import { setupUser } from '@/tests/helpers'

const GENERAL_LINKS = ['Dashboard', 'Families', 'Documents', 'Collections']
const SUPERUSER_LINKS = [
  'Corpora',
  'Corpus Types',
  'Organisations',
  'Users',
  'Create App Token',
  'CSV Upload',
  'PDF Upload',
]

const openMenu = async () => {
  customRender(<SideMenu />)
  await userEvent.click(screen.getByRole('button', { name: 'Open menu' }))
  await screen.findByText('Menu')
}

describe('SideMenu', () => {
  afterEach(() => setupUser())

  it('shows every link to superusers', async () => {
    setupUser({ isSuperuser: true })
    await openMenu()

    for (const name of [...GENERAL_LINKS, ...SUPERUSER_LINKS]) {
      expect(screen.getByRole('link', { name })).toBeInTheDocument()
    }
  })

  it('hides superuser-only links from non-superusers', async () => {
    setupUser({ isSuperuser: false })
    await openMenu()

    for (const name of GENERAL_LINKS) {
      expect(screen.getByRole('link', { name })).toBeInTheDocument()
    }
    for (const name of SUPERUSER_LINKS) {
      expect(screen.queryByRole('link', { name })).not.toBeInTheDocument()
    }
  })
})
