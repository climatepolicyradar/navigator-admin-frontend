import { screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { mcfConfigMock, unfcccConfigMock } from '../../utilsTest/mocks'
import { customRender } from '@/tests/utilsTest/render'
import { DocumentForm } from '@/components/forms/DocumentForm'
import { IConfigTaxonomyUNFCCC, IDocument } from '@/interfaces'
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

  it('displays original values for all fields', async () => {
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

    const roleDropdown = screen.getByRole('combobox', { name: 'Role' })
    expect(roleDropdown).toBeInTheDocument()

    // Simulate opening the dropdown
    await userEvent.click(roleDropdown)

    const options = screen.getAllByRole('option', { hidden: true })
    const selectedOption = options.find(
      (option) => option.textContent === mockDocument.metadata?.role?.[0],
    )
    expect(selectedOption).toBeInTheDocument()
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

    const roleDropdown = screen.getByRole('combobox', { name: 'Role' })
    expect(roleDropdown).toBeInTheDocument()

    await userEvent.click(roleDropdown)

    // Retrieve allowed values from mockUNFCCCTaxonomy
    const taxonomy = mockUNFCCCTaxonomy as IConfigTaxonomyUNFCCC
    const allowedValues = taxonomy._document?.role.allowed_values || []

    // Use getAllByRole to find all options in the dropdown
    const roleOptions = screen.getAllByRole('option')

    // Check if each allowed value is in the dropdown options
    allowedValues.forEach((value) => {
      const option = Array.from(roleOptions).find(
        (option) => option.textContent === value,
      )
      expect(option).toBeInTheDocument()
    })
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

    const languageDropdown = screen.getByRole('combobox', { name: 'Language' })
    expect(languageDropdown).toBeInTheDocument()

    const submitButton = screen.getByText('Update Document')
    expect(submitButton).toBeDefined()

    // Original language as default
    await waitFor(() => {
      expect(screen.getByText('Default language')).toBeInTheDocument()
    })

    // Simulate opening the dropdown
    await userEvent.click(languageDropdown)

    // Find and select 'English' from the dropdown
    const englishOption = await screen.findByText('English')
    await userEvent.click(englishOption)

    // Verify 'English' is selected by checking the hidden input value
    const hiddenInput = screen.getByDisplayValue('en')
    expect(hiddenInput).toBeInTheDocument()

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

  it('allows selection of multiple document types', async () => {
    customRender(
      <DocumentForm
        familyId={'test'}
        onSuccess={onDocumentFormSuccess}
        document={mockDocument}
        taxonomy={mockUNFCCCTaxonomy}
      />,
    )

    const typeDropdown = screen.getByRole('combobox', { name: 'Type' })
    expect(typeDropdown).toBeInTheDocument()

    await userEvent.click(typeDropdown)
    const selectedOption1 = screen.getByRole('option', {
      name: 'Type One',
    })
    await userEvent.click(selectedOption1)
    expect(screen.getByText('Type One')).toBeInTheDocument()

    await userEvent.click(typeDropdown)
    const selectedOption2 = screen.getByRole('option', {
      name: 'Type Two',
    })
    await userEvent.click(selectedOption2)

    expect(screen.getByText('Type Two')).toBeInTheDocument()
    expect(screen.getByText('Type One')).toBeInTheDocument()
  })
})
