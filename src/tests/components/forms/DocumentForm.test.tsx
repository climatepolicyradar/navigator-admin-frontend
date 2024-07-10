import '@testing-library/jest-dom'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { customRender } from '@/tests/utilsTest/render'
import { DocumentForm } from '@/components/forms/DocumentForm'
import { IDocument } from '@/interfaces'

jest.mock('@/api', () => ({
  getApiUrl: jest.fn().mockReturnValue('http://mock-api-url'),
}))

jest.mock('@/api/Documents', () => ({
  createDocument: jest
    .fn()
    .mockResolvedValue({ response: { documentId: 'some-id' } }),
  updateDocument: jest
    .fn()
    .mockResolvedValue({ response: { documentId: 'some-id' } }),
}))

const mockDocument: IDocument = {
  import_id: '12345',
  family_import_id: '67890',
  variant_name: 'Variant Name',
  status: 'Active',
  type: 'PDF',
  metadata: { role: ['Editor'] },
  slug: 'document-slug',
  physical_id: 101,
  title: 'Sample Document Title',
  md5_sum: '1a79a4d60de6718e8e5b326e338ae533',
  cdn_object: 'cdn/path/to/document',
  source_url: 'http://example.com/document',
  content_type: 'application/pdf',
  user_language_name: 'Default language',
  created: '3/1/2021',
  last_modified: '4/1/2021',
}

// Tests
describe('DocumentForm', () => {
  const onDocumentFormSuccess = jest.fn()

  beforeEach(() => {
    onDocumentFormSuccess.mockReset()
  })

  it('validate incorrect document URL', async () => {
    customRender(
      <DocumentForm
        familyId={'test'}
        onSuccess={onDocumentFormSuccess}
        document={mockDocument}
      />,
    )

    const input = screen.getByRole('textbox', { name: /source url/i })
    const submitButton = screen.getByText('Update Document')

    const newUrl = 'test-invalid-url'
    fireEvent.change(input, { target: { value: newUrl } })
    await waitFor(() => {
      expect(input).toHaveValue(newUrl)
    })
    fireEvent.submit(submitButton)

    await waitFor(() => {
      const errorMessage = screen.getByRole('error')
      expect(errorMessage).toBeInTheDocument()
    })
  })

  it('validate empty document URL', async () => {
    customRender(
      <DocumentForm
        familyId={'test'}
        onSuccess={onDocumentFormSuccess}
        document={mockDocument}
      />,
    )

    const input = screen.getByRole('textbox', { name: /source url/i })
    const submitButton = screen.getByText('Update Document')

    const newUrl = ''
    fireEvent.change(input, { target: { value: newUrl } })
    await waitFor(() => {
      expect(input).toHaveValue(newUrl)
    })
    fireEvent.submit(submitButton)

    await waitFor(() => {
      expect(onDocumentFormSuccess).toHaveBeenCalled()
    })
  })

  it('validate correct document URL', async () => {
    customRender(
      <DocumentForm
        familyId={'test'}
        onSuccess={onDocumentFormSuccess}
        document={mockDocument}
      />,
    )

    const input = screen.getByRole('textbox', { name: /source url/i })
    const submitButton = screen.getByText('Update Document')

    const newUrl = 'http://source.com'
    fireEvent.change(input, { target: { value: newUrl } })
    await waitFor(() => {
      expect(input).toHaveValue(newUrl)
    })
    fireEvent.submit(submitButton)

    await waitFor(() => {
      expect(onDocumentFormSuccess).toHaveBeenCalled()
    })
  })

  it('allows selecting a language', async () => {
    customRender(
      <DocumentForm
        familyId={'test'}
        onSuccess={onDocumentFormSuccess}
        document={mockDocument}
      />,
    )

    const languageDropdown = screen.getByTestId('language-select')
    const submitButton = screen.getByText('Update Document')

    expect(languageDropdown).toBeDefined()
    expect(languageDropdown).not.toBeNull()
    expect(submitButton).toBeDefined()
    expect(submitButton).not.toBeNull()

    // Original language as default
    await waitFor(() => {
      expect(screen.getByText('Default language')).toBeInTheDocument()
    })

    // Open the dropdown
    const languageSelectDropdown = screen
      .getByTestId('language-select')
      .querySelector('div')
    if (languageSelectDropdown) {
      fireEvent.click(languageSelectDropdown)
    } else {
      throw new Error('Dropdown not found')
    }

    // Check no errors at submit
    fireEvent.submit(submitButton)
    await waitFor(() => {
      expect(onDocumentFormSuccess).toHaveBeenCalled()
    })
  })
})
