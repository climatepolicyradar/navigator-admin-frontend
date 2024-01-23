import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DocumentForm } from '@/components/forms/DocumentForm'
import { IDocument } from '@/interfaces'

jest.mock('@/api/Documents', () => ({
  createDocument: jest.fn(),
  updateDocument: jest.fn(),
}))
jest.mock('@/hooks/useConfig', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    config: {
      document: {
        roles: ['role1', 'role2'],
        types: ['type1', 'type2'],
        variants: ['variant1', 'variant2'],
      },
      languages: {
        en: 'English',
        es: 'Spanish',
      },
    },
    loading: false,
    error: null,
  })),
}))

const onDocumentFormSuccess = jest.fn()

const mockDocument: IDocument = {
  import_id: '12345',
  family_import_id: '67890',
  variant_name: 'Variant Name',
  status: 'Active',
  role: 'Editor',
  type: 'PDF',
  slug: 'document-slug',
  physical_id: 101,
  title: 'Sample Document Title',
  md5_sum: '1a79a4d60de6718e8e5b326e338ae533',
  cdn_object: 'cdn/path/to/document',
  source_url: 'http://example.com/document',
  content_type: 'application/pdf',
  user_language_name: 'English',
}

describe('DocumentForm', () => {
  it('valida el formulario correctamente', async () => {
    render(
      <DocumentForm
        familyId={'test'}
        onSuccess={onDocumentFormSuccess}
        document={mockDocument}
      />,
    )

    const input = screen.getByRole('textbox', { name: /source url/i })

    await userEvent.clear(input)
    await userEvent.type(input, 'ttp://example.com')
    await userEvent.keyboard('{Enter}')
    await waitFor(() => {
      expect(input).toHaveValue('ttp://example.com')
    })

    const submitButton = screen.getByText('Update Document')
    await userEvent.click(submitButton)

    await waitFor(() => {
      const errorMessage = screen.getByText(/must be a valid URL/i)
      expect(errorMessage).toBeInTheDocument()
    })
  })
})
