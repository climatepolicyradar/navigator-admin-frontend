import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CorpusForm } from '@/components/forms/CorpusForm'
import { createCorpus, updateCorpus } from '@/api/Corpora'
import useConfig from '@/hooks/useConfig'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import '../../setup'

// Mock the API calls
vi.mock('@/api/Corpora', () => ({
  createCorpus: vi.fn(),
  updateCorpus: vi.fn(),
}))

vi.mock('@/hooks/useConfig', () => ({
  default: vi.fn(),
}))

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(actual as object),
    useNavigate: () => mockNavigate,
  }
})

const mockConfig = {
  corpora: [
    {
      corpus_type: 'Test Corpus Type 1',
      corpus_type_description: 'Test Corpus Type Description 1',
      organisation: {
        id: 1,
        name: 'Test Organisation 1',
      },
    },
    {
      corpus_type: 'Test Corpus Type 2',
      corpus_type_description: 'Test Corpus Type Description 2',
      organisation: {
        id: 2,
        name: 'Test Organisation 2',
      },
    },
  ],
}

const mockUseConfig = useConfig as unknown as ReturnType<typeof vi.fn>

describe('CorpusForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseConfig.mockReturnValue({
      config: mockConfig,
      loading: false,
      error: null,
    })
  })

  const renderCorpusForm = (props = {}) => {
    return render(
      <ChakraProvider>
        <BrowserRouter>
          <CorpusForm {...props} />
        </BrowserRouter>
      </ChakraProvider>,
    )
  }

  describe('Form Rendering', () => {
    it('renders all form fields correctly for new corpus', () => {
      renderCorpusForm()

      expect(screen.getByRole('textbox', { name: 'Title' })).toBeInTheDocument()
      expect(
        screen.getByRole('textbox', { name: 'Description' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('textbox', { name: 'rdw-editor' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('textbox', { name: 'Corpus Image URL' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('group', { name: 'Corpus Type Name' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('group', { name: 'Organisation' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /create new corpus/i }),
      ).toBeInTheDocument()
    })

    it('shows all corpus type options when clicking the select', async () => {
      renderCorpusForm()

      // Click the corpus type select to open options
      const corpusTypeSelect = within(
        screen.getByTestId('corpus-type-select'),
      ).getByText('Select...')
      await userEvent.click(corpusTypeSelect)

      // Verify all options from mockConfig are shown
      mockConfig.corpora.forEach((corpus) => {
        expect(screen.getByText(corpus.corpus_type)).toBeInTheDocument()
      })
    })

    it('shows all organisation options with correct labels and values when clicking the select', async () => {
      renderCorpusForm()

      // Click the organisation select to open options
      const organisationSelect = within(
        screen.getByTestId('organisation-select'),
      ).getByText('Select...')
      await userEvent.click(organisationSelect)

      // Verify all options from mockConfig are shown with correct label and value
      const uniqueOrganisations = Array.from(
        new Set(
          mockConfig.corpora
            .filter((corpus) => corpus.organisation)
            .map((corpus) => JSON.stringify(corpus.organisation)),
        ),
      ).map((org) => JSON.parse(org) as { id: number; name: string })

      uniqueOrganisations.forEach((org: { id: number; name: string }) => {
        // Find the option by its label text
        const option = screen.getByText(org.name)
        expect(option).toBeInTheDocument()

        // The parent div contains the value information
        const optionContainer = option.closest('[id^="react-select-"]')
        expect(optionContainer).toHaveAttribute(
          'id',
          expect.stringContaining(`-option-${org.id - 1}`),
        )
      })
    })

    it('renders form fields with loaded corpus data', () => {
      const mockCorpus = {
        import_id: 'test-id',
        title: 'Test Corpus',
        description: 'Test Description',
        corpus_text: '<p>Test Text</p>',
        corpus_image_url: 'http://test.com/image.jpg',
        corpus_type_name: 'Test Corpus Type 1',
        corpus_type_description: 'Test Corpus Type Description 1',
        organisation_id: 1,
      }

      renderCorpusForm({ corpus: mockCorpus })

      expect(screen.getByRole('textbox', { name: 'Import ID' })).toHaveValue(
        'test-id',
      )
      expect(screen.getByRole('textbox', { name: 'Title' })).toHaveValue(
        'Test Corpus',
      )
      expect(screen.getByRole('textbox', { name: 'Description' })).toHaveValue(
        'Test Description',
      )
      expect(
        screen.getByRole('textbox', { name: 'rdw-editor' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('textbox', { name: 'Corpus Image URL' }),
      ).toHaveValue('http://test.com/image.jpg')
      expect(screen.getByTestId('corpus-type-select')).toBeInTheDocument()
      expect(screen.getByText('Test Corpus Type 1')).toBeInTheDocument()
      expect(
        screen.getByRole('textbox', { name: 'Corpus Type Description' }),
      ).toHaveValue('Test Corpus Type Description 1')
      expect(screen.getByTestId('organisation-select')).toBeInTheDocument()
      expect(screen.getByText('Test Organisation 1')).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /update corpus/i }),
      ).toBeInTheDocument()
    })

    it('displays error message when config fails to load', () => {
      mockUseConfig.mockReturnValue({
        config: null,
        loading: false,
        error: { message: 'Failed to load config' },
      })

      renderCorpusForm()
      expect(screen.getByText(/failed to load config/i)).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('successfully creates a new corpus', async () => {
      const mockCreateResponse = { response: 'new-id' }
      vi.mocked(createCorpus).mockResolvedValueOnce(mockCreateResponse)

      const user = userEvent.setup()
      renderCorpusForm()

      // Fill in text fields
      await user.type(
        screen.getByRole('textbox', { name: 'Title' }),
        'New Corpus',
      )
      await user.type(
        screen.getByRole('textbox', { name: 'Description' }),
        'New Description',
      )

      // Select corpus type
      const corpusTypeSelect = within(
        screen.getByTestId('corpus-type-select'),
      ).getByRole('combobox')
      await user.click(corpusTypeSelect)
      await user.type(corpusTypeSelect, 'Test Corpus Type 1{enter}')

      // Select organisation
      const orgSelect = within(
        screen.getByTestId('organisation-select'),
      ).getByRole('combobox')
      await user.click(orgSelect)
      await user.type(orgSelect, 'Test Organisation 1{enter}')

      // Submit the form
      await user.click(
        screen.getByRole('button', { name: /create new corpus/i }),
      )

      // Wait for form submission and verify API call
      await waitFor(() => {
        expect(createCorpus).toHaveBeenCalledWith({
          title: 'New Corpus',
          description: 'New Description',
          corpus_text: null,
          corpus_image_url: null,
          corpus_type_name: 'Test Corpus Type 1',
          organisation_id: 1,
        })
      })

      // Verify navigation after success
      expect(mockNavigate).toHaveBeenCalledWith('/corpora')
    })

    it('successfully updates an existing corpus', async () => {
      const mockUpdateResponse = {
        response: {
          import_id: 'test-id',
          title: 'Updated Title',
          description: 'Updated Description',
          corpus_type_name: 'test-type',
          corpus_type_description: 'Test Type Description',
          corpus_text: null,
          corpus_image_url: null,
          organisation_id: 1,
          organisation_name: 'test-org',
        },
      }
      vi.mocked(updateCorpus).mockResolvedValueOnce(mockUpdateResponse)

      // Use the default mockConfig
      mockUseConfig.mockReturnValue({
        config: mockConfig,
        loading: false,
        error: null,
      })

      const mockCorpus = {
        import_id: 'test-id',
        title: 'Original Title',
        description: 'Original Description',
        organisation_id: 1,
        organisation_name: 'Test Organisation 1',
        corpus_text: 'TBD',
        corpus_image_url: null,
        corpus_type_name: 'Test Corpus Type 1',
        corpus_type_description: 'Test Corpus Type Description 1',
      }

      const user = userEvent.setup()

      renderCorpusForm({
        corpus: mockCorpus,
      })

      // Wait for all form fields to be initialized
      await waitFor(() => {
        // Check required fields
        expect(screen.getByRole('textbox', { name: 'Title' })).toHaveValue(
          'Original Title',
        )
        expect(
          screen.getByRole('textbox', { name: 'Description' }),
        ).toHaveValue('Original Description')

        // Check optional fields
        expect(
          screen.getByRole('textbox', { name: 'Corpus Image URL' }),
        ).toHaveValue('')

        // Check corpus type fields
        expect(screen.getByTestId('corpus-type-select')).toBeInTheDocument()
        expect(
          screen.getByRole('textbox', { name: 'Corpus Type Description' }),
        ).toHaveValue('Test Corpus Type Description 1')
      })

      // Fill form fields
      const titleInput = screen.getByRole('textbox', { name: 'Title' })
      const descInput = screen.getByRole('textbox', { name: 'Description' })
      const corpusTypeDescInput = screen.getByRole('textbox', {
        name: 'Corpus Type Description',
      })

      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Corpus')

      await user.clear(descInput)
      await user.type(descInput, 'Updated Description')

      await user.clear(corpusTypeDescInput)
      await user.type(corpusTypeDescInput, 'Test Corpus Type Description 1')

      // Submit form
      const submitButton = screen.getByRole('button', {
        name: /update corpus/i,
      })
      await user.click(submitButton)

      // Wait for form submission
      await waitFor(() => {
        expect(updateCorpus).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Updated Corpus',
            description: 'Updated Description',
            corpus_text: 'TBD',
            corpus_image_url: null,
            corpus_type_description: 'Test Corpus Type Description 1',
          }),
          'test-id',
        )
      })
    })
  })
  //       title: 'Test Corpus',
})
