import { screen, waitFor, fireEvent, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { mcfConfigMock, unfcccConfigMock } from '../../utilsTest/mocks'
import { customRender } from '@/tests/utilsTest/render'
import { DocumentForm } from '@/components/forms/DocumentForm'
import { IDocument } from '@/interfaces'
import userEvent from '@testing-library/user-event'

vi.mock('@/api/Documents', () => ({
  createDocument: vi
    .fn()
    .mockResolvedValue({ response: { documentId: 'some-id' } }),
  updateDocument: vi
    .fn()
    .mockResolvedValue({ response: { documentId: 'some-id' } }),
}))

const mockDocument: IDocument = {
  import_id: '12345',
  family_import_id: '67890',
  variant_name: 'Variant Name',
  status: 'Active',
  metadata: { role: ['Role One'], type: ['PDF'] },
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

const mockUNFCCCTaxonomy = unfcccConfigMock.corpora[0].taxonomy
const mockMCFTaxonomy = mcfConfigMock.corpora[0].taxonomy

describe('DocumentForm', () => {
  const onDocumentFormSuccess = vi.fn()

  beforeEach(() => {
    onDocumentFormSuccess.mockReset()
  })

  it('displays original values for all fields', () => {
    customRender(
      <DocumentForm
        familyId={'test'}
        onSuccess={onDocumentFormSuccess}
        document={mockDocument}
        taxonomy={mockUNFCCCTaxonomy}
      />,
    )

    expect(screen.getByRole('textbox', { name: 'Family ID' })).toHaveValue(
      mockDocument.family_import_id,
    )
    expect(screen.getByRole('textbox', { name: 'Title' })).toHaveValue(
      mockDocument.title,
    )
    expect(screen.getByRole('textbox', { name: 'Source URL' })).toHaveValue(
      mockDocument.source_url,
    )

    const roleDropdown = within(screen.getByRole('group', { name: 'Role' }))

    expect(roleDropdown.getByText('Role One')).toBeInTheDocument()
  })

  it('shows allowed values when clicking on role dropdown', async () => {
    customRender(
      <DocumentForm
        familyId={'test'}
        onSuccess={onDocumentFormSuccess}
        document={mockDocument}
        taxonomy={mockUNFCCCTaxonomy}
      />,
    )

    const roleDropdown = within(
      screen.getByRole('group', { name: 'Role' }),
    ).getByText('Please select')
    expect(roleDropdown).toBeInTheDocument()

    await userEvent.click(roleDropdown)

    expect(screen.getByText('Role One')).toBeInTheDocument()
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

  it('does not render document role controller if property does not exist on taxonomy', () => {
    customRender(
      <DocumentForm
        familyId={'test'}
        onSuccess={onDocumentFormSuccess}
        document={mockDocument}
        taxonomy={mockMCFTaxonomy}
      />,
    )

    expect(screen.queryByText('Role')).not.toBeInTheDocument()
  })

  it('does not render document type controller if property does not exist on taxonomy', () => {
    customRender(
      <DocumentForm
        familyId={'test'}
        onSuccess={onDocumentFormSuccess}
        document={mockDocument}
        taxonomy={mockMCFTaxonomy}
      />,
    )

    expect(screen.queryByText('Type')).not.toBeInTheDocument()
  })

  it('renders role and type controller if properties exist on taxonomy', () => {
    customRender(
      <DocumentForm
        familyId={'test'}
        onSuccess={onDocumentFormSuccess}
        document={mockDocument}
        taxonomy={mockUNFCCCTaxonomy}
      />,
    )

    expect(screen.getByText('Role')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
  })
})
