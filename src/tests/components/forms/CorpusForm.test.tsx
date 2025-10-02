import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CorpusForm } from '@/components/forms/CorpusForm'
import { createCorpus, updateCorpus } from '@/api/Corpora'
import useConfig from '@/hooks/useConfig'
import useCorpusTypes from '@/hooks/useCorpusTypes'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import '../../setup'
import { ICorpusType } from '@/interfaces/CorpusType'
import useCorpora from '@/hooks/useCorpora'
import React from 'react'

// Mock the API calls
vi.mock('@/api/Corpora', () => ({
  createCorpus: vi.fn(),
  updateCorpus: vi.fn(),
  getCorpora: vi.fn(),
}))

vi.mock('@/hooks/useConfig', () => ({
  default: vi.fn(),
}))

vi.mock('@/hooks/useCorpusTypes', () => ({
  default: vi.fn(),
}))

vi.mock('@/hooks/useCorpora', () => ({
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
        name: 'TEST',
        display_name: 'Test Organisation 1',
        type: 'Test',
      },
    },
    {
      corpus_type: 'Test Corpus Type 2',
      corpus_type_description: 'Test Corpus Type Description 2',
      organisation: {
        id: 2,
        name: 'CCLW',
        display_name: 'Test Organisation 2',
        type: 'Academic',
      },
    },
  ],
}

const mockCorpusTypes: ICorpusType[] = [
  {
    name: 'Test Corpus Type 1',
    description: 'Test Corpus Type Description 1',
  },
  {
    name: 'Test Corpus Type 2',
    description: 'Test Corpus Type Description 2',
  },
]

const mockUseConfig = useConfig as unknown as ReturnType<typeof vi.fn>
const mockUseCorpusTypes = useCorpusTypes as unknown as ReturnType<typeof vi.fn>

const mockUseCorpora = useCorpora as unknown as ReturnType<typeof vi.fn>

vi.mock('@/components/form-components/WYSIWYG', () => ({
  WYSIWYG: ({
    html,
    onChange,
    id,
  }: {
    html: string
    onChange: (val: string) => void
    id?: string
  }) => (
    <textarea
      data-testid='corpus-text-editor'
      defaultValue={html}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
        onChange(e.target.value)
      }
      id={id}
    />
  ),
}))

describe('CorpusForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseConfig.mockReturnValue({
      config: mockConfig,
      loading: false,
      error: null,
    })
    mockUseCorpusTypes.mockReturnValue({
      corpusTypes: mockCorpusTypes,
      loading: false,
      error: null,
    })
    mockUseCorpora.mockReturnValue({
      corpora: [],
      loading: false,
      error: null,
      reload: vi.fn(),
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
    it('renders all form fields correctly for new corpus', async () => {
      renderCorpusForm()

      expect(screen.getByRole('textbox', { name: 'Title' })).toBeInTheDocument()
      expect(
        screen.getByRole('textbox', { name: 'Corpus Attribution URL' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('textbox', { name: 'Description' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('textbox', { name: 'Corpus Image URL' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('group', { name: 'Corpus Type Name' }),
      ).toBeInTheDocument()
      expect(
        await screen.findByRole('group', { name: 'Organisation' }),
      ).toBeInTheDocument()

      expect(
        screen.getByRole('combobox', { name: 'Part 1' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('textbox', { name: 'Part 2' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('textbox', { name: 'Part 3' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('textbox', { name: 'Part 4' }),
      ).toBeInTheDocument()

      expect(
        screen.getByRole('button', { name: /create new corpus/i }),
      ).toBeInTheDocument()
    })

    it('shows all corpus type options when clicking the select', async () => {
      renderCorpusForm()

      const corpusTypeSelectGroup = screen.getByRole('group', {
        name: 'Corpus Type Name',
      })
      expect(corpusTypeSelectGroup).toBeInTheDocument()

      // Click the corpus type select to open options
      const corpusTypeSelect = within(corpusTypeSelectGroup).getByText(
        'Select...',
      )

      await userEvent.click(corpusTypeSelect)
      await waitFor(() => {
        mockConfig.corpora.forEach((corpus) => {
          expect(screen.getByText(corpus.corpus_type)).toBeInTheDocument()
        })
      })
    })

    it('shows all organisation options with correct labels and values when clicking the select', async () => {
      renderCorpusForm()

      const organisationSelectGroup = await screen.findByRole('group', {
        name: 'Organisation',
      })
      expect(organisationSelectGroup).toBeInTheDocument()

      // Click the organisation select to open options
      const combobox = within(organisationSelectGroup).getByRole('combobox')
      await userEvent.click(combobox)

      // Verify all options from mockConfig are shown with correct label and value
      const uniqueOrganisations = Array.from(
        new Set(
          mockConfig.corpora
            .filter((corpus) => corpus.organisation)
            .map((corpus) => JSON.stringify(corpus.organisation)),
        ),
      ).map(
        (org) =>
          JSON.parse(org) as {
            id: number
            name: string
            type: string
            display_name: string
          },
      )

      uniqueOrganisations.forEach(
        (org: {
          id: number
          name: string
          type: string
          display_name: string
        }) => {
          // Find the option by its label text
          const option = screen.getByText(org.display_name)
          expect(option).toBeInTheDocument()

          // The parent div contains the value information
          const optionContainer = option.closest('[id^="react-select-"]')
          expect(optionContainer).toHaveAttribute(
            'id',
            expect.stringContaining(`-option-${org.id - 1}`),
          )
        },
      )
    })

    it('renders form fields with loaded corpus data', async () => {
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
        screen.getByRole('textbox', { name: 'Corpus Image URL' }),
      ).toHaveValue('http://test.com/image.jpg')
      expect(screen.getByTestId('corpus-type-select')).toBeInTheDocument()
      expect(screen.getByText('Test Corpus Type 1')).toBeInTheDocument()
      expect(
        screen.getByRole('textbox', { name: 'Corpus Type Description' }),
      ).toHaveValue('Test Corpus Type Description 1')
      expect(
        await screen.findByTestId('organisation-select'),
      ).toBeInTheDocument()
      expect(screen.getByText('Test Organisation 1')).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /update corpus/i }),
      ).toBeInTheDocument()

      // Don't show import ID builder section.
      expect(screen.queryByText('Part 1')).not.toBeInTheDocument()
      expect(screen.queryByText('Part 2')).not.toBeInTheDocument()
      expect(screen.queryByText('Part 3')).not.toBeInTheDocument()
      expect(screen.queryByText('Part 4')).not.toBeInTheDocument()
    })

    it('displays error message when config fails to load', () => {
      // Mock the return value of useConfig
      mockUseConfig.mockReturnValue({
        config: null,
        loading: false,
        error: { message: 'Failed to load config' },
      })

      renderCorpusForm()

      // Wait for the error message to appear
      expect(screen.getByText(/failed to load config/i)).toBeInTheDocument()
    })

    it('renders an empty string when corpus attribution url is null', () => {
      const mockCorpus = {
        import_id: 'test-id',
        title: 'Test Corpus',
        description: null,
        corpus_text: '<p>Test Text</p>',
        corpus_image_url: null,
        corpus_type_name: 'Test Corpus Type 1',
        corpus_type_description: 'Test Corpus Type Description 1',
        organisation_id: 1,
        attribution_url: null,
      }

      renderCorpusForm({ corpus: mockCorpus })

      expect(
        screen.getByRole('textbox', { name: 'Corpus Attribution URL' }),
      ).toHaveValue('')
    })
  })

  describe('Form Submission', () => {
    it('successfully creates a new corpus using default import ID values', async () => {
      const mockCreateResponse = { response: 'TEST.corpus.i00000001.n0000' }
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

      // Fill in corpus text (WYSIWYG editor)
      const corpusTextEditor = screen.getByTestId('corpus-text-editor')
      await userEvent.clear(corpusTextEditor)
      await userEvent.type(corpusTextEditor, 'Test corpus content')

      // Select corpus type
      const corpusTypeSelectGroup = screen.getByRole('group', {
        name: 'Corpus Type Name',
      })
      expect(corpusTypeSelectGroup).toBeInTheDocument()
      const corpusTypeSelect = within(corpusTypeSelectGroup).getByText(
        'Select...',
      )
      await user.click(corpusTypeSelect)
      await user.type(corpusTypeSelect, 'Test Corpus Type 1{enter}')

      // Select organisation
      const orgSelect = within(
        screen.getByTestId('organisation-select'),
      ).getByRole('combobox')
      await user.click(orgSelect)
      await user.type(orgSelect, '1{enter}')

      // Build import ID
      const part1 = screen.getByRole('combobox', {
        name: 'Part 1',
      })
      expect(part1).toBeInTheDocument()
      await user.click(part1)
      await user.type(part1, 'Test{enter}')

      // Submit the form
      await user.click(
        screen.getByRole('button', { name: /create new corpus/i }),
      )

      // Wait for form submission and verify API call
      await waitFor(() => {
        expect(createCorpus).toHaveBeenCalledWith({
          import_id: 'TEST.corpus.i00000001.n0000',
          title: 'New Corpus',
          description: 'New Description',
          corpus_text: 'Test corpus content',
          corpus_image_url: null,
          corpus_type_name: 'Test Corpus Type 1',
          organisation_id: 1,
        })
      })

      // Verify navigation after success
      expect(mockNavigate).toHaveBeenCalledWith('/corpora')
    })

    it('successfully creates a new corpus using non-default import ID values', async () => {
      const mockCreateResponse = { response: 'Academic.corpus.CCLW.apples' }
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

      // Fill in corpus text (WYSIWYG editor)
      const corpusTextEditor = screen.getByTestId('corpus-text-editor')
      await userEvent.clear(corpusTextEditor)
      await userEvent.type(corpusTextEditor, 'Test corpus content')

      // Select corpus type
      const corpusTypeSelectGroup = screen.getByRole('group', {
        name: 'Corpus Type Name',
      })
      expect(corpusTypeSelectGroup).toBeInTheDocument()
      const corpusTypeSelect = within(corpusTypeSelectGroup).getByText(
        'Select...',
      )
      await user.click(corpusTypeSelect)
      await user.type(corpusTypeSelect, 'Test Corpus Type 1{enter}')

      // Select organisation
      const orgSelect = within(
        screen.getByTestId('organisation-select'),
      ).getByRole('combobox')
      await user.click(orgSelect)
      await user.type(orgSelect, '2{enter}')

      // Build import ID
      const part1 = screen.getByRole('combobox', {
        name: 'Part 1',
      })
      expect(part1).toBeInTheDocument()
      await user.click(part1)
      await user.type(part1, 'Academic{enter}')

      const part4 = screen.getByRole('textbox', {
        name: 'Part 4',
      })
      await user.clear(part4)
      await user.type(part4, 'apples{enter}')

      // Submit the form
      await user.click(
        screen.getByRole('button', { name: /create new corpus/i }),
      )

      // Wait for form submission and verify API call
      await waitFor(() => {
        expect(createCorpus).toHaveBeenCalledWith({
          import_id: 'Academic.corpus.CCLW.apples',
          title: 'New Corpus',
          description: 'New Description',
          corpus_text: 'Test corpus content',
          corpus_image_url: null,
          corpus_type_name: 'Test Corpus Type 1',
          organisation_id: 2,
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
          description: null,
          corpus_type_name: 'test-type',
          corpus_type_description: 'Test Type Description',
          corpus_text: 'Updated Corpus Text',
          corpus_image_url: null,
          organisation_id: 1,
          organisation_name: 'test-org',
          attribution_url: null,
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
        corpus_text: '<p>TBD</p>',
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
        expect(screen.getByRole('textbox', { name: 'Title' })).toHaveValue(
          'Original Title',
        )
        expect(
          screen.getByRole('textbox', { name: 'Description' }),
        ).toHaveValue('Original Description')

        expect(
          screen.getByRole('textbox', { name: 'Corpus Image URL' }),
        ).toHaveValue('')

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
            corpus_text: '<p>TBD</p>',
            corpus_image_url: null,
            corpus_type_description: 'Test Corpus Type Description 1',
          }),
          'test-id',
        )
      })
    })

    it.only('successfully updates an existing corpus with attribution URL', async () => {
      const mockUpdateResponse = {
        response: {
          import_id: 'test-id',
          title: 'Updated Title',
          description: null,
          corpus_type_name: 'test-type',
          corpus_type_description: 'Test Type Description',
          corpus_text: 'Updated Corpus Text',
          corpus_image_url: null,
          organisation_id: 1,
          organisation_name: 'test-org',
          attribution_url: 'http://test.com/attribution',
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
        corpus_text: '<p>TBD</p>',
        corpus_image_url: null,
        corpus_type_name: 'Test Corpus Type 1',
        corpus_type_description: 'Test Corpus Type Description 1',
        attribution_url: 'www.test-attribution-url.com',
      }
      const user = userEvent.setup()

      renderCorpusForm({
        corpus: mockCorpus,
      })

      await waitFor(() => {
        expect(
          screen.getByRole('textbox', { name: 'Corpus Attribution URL' }),
        ).toHaveValue('www.test-attribution-url.com')
      })

      const attributionUrlInput = screen.getByRole('textbox', {
        name: 'Corpus Attribution URL',
      })

      await user.clear(attributionUrlInput)
      await user.type(attributionUrlInput, 'http://test.com/attribution')

      // Submit form
      const submitButton = screen.getByRole('button', {
        name: /update corpus/i,
      })
      await user.click(submitButton)

      await waitFor(() => {
        expect(updateCorpus).toHaveBeenCalledWith(
          expect.objectContaining({
            attribution_url: 'http://test.com/attribution',
          }),
          'test-id',
        )
      })
    })
  })
})
