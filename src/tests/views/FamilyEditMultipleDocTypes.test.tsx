import { screen } from '@testing-library/react'

import { setupUser } from '../helpers.ts'
import { renderRoute } from '../utilsTest/renderRoute.tsx'

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: unknown = await importOriginal()
  return {
    ...(actual as Record<string, unknown>),
    useBlocker: vi.fn(),
  }
})

describe('', () => {
  it('displays multiple document types after creating a document', async () => {
    setupUser({ organisationName: 'UNFCCC', orgId: 3 })
    const { user } = renderRoute(
      '/family/mockUNFCCCFamilyNoDocumentsNoEvents/edit',
    )

    expect(
      await screen.findByText('Editing: UNFCCC Family Three'),
    ).toBeInTheDocument()
    expect(await screen.findByText('Documents')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add new Document' }))

    expect(
      screen.getByRole('dialog', {
        name: 'Add new Document',
      }),
    ).toBeInTheDocument()

    const documentTitle = screen.getByRole('textbox', { name: 'Title' })

    await user.type(documentTitle, 'New document title')

    const roleDropdown = screen.getByRole('combobox', { name: 'Role' })

    await user.click(roleDropdown)
    const selectedRole = screen.getByRole('option', {
      name: 'Role One',
    })
    await user.click(selectedRole)

    const typeDropdown = screen.getByRole('combobox', { name: 'Type' })

    await user.click(typeDropdown)
    const selectedType1 = screen.getByRole('option', {
      name: 'Type One',
    })
    await user.click(selectedType1)

    await user.click(typeDropdown)
    const selectedType2 = screen.getByRole('option', {
      name: 'Type Two',
    })
    await user.click(selectedType2)

    await user.click(
      screen.getByRole('button', { name: 'Create new Document' }),
    )

    expect(
      screen.queryByRole('dialog', {
        name: 'Add new Document',
      }),
    ).not.toBeInTheDocument()

    expect(
      await screen.findByText('Document has been successfully created'),
    ).toBeInTheDocument()
    expect(
      await screen.findByText('Type: Type One, Type Two'),
    ).toBeInTheDocument()
  })
})
