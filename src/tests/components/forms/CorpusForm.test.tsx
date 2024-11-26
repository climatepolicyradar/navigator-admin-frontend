import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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
      corpus_type: 'Test Corpus Type',
      corpus_type_description: 'Test Corpus Type Description',
      organisation: {
        id: 1,
        name: 'Test Organisation',
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

    it('renders form fields with loaded corpus data', () => {
      const mockCorpus = {
        import_id: 'test-id',
        title: 'Test Corpus',
        description: 'Test Description',
        corpus_text: '<p>Test Text</p>',
        corpus_image_url: 'http://test.com/image.jpg',
        corpus_type_name: 'Test Corpus Type',
        corpus_type_description: 'Test Corpus Type Description',
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
      expect(screen.getByText('Test Corpus Type')).toBeInTheDocument()
      expect(
        screen.getByRole('textbox', { name: 'Corpus Type Description' }),
      ).toHaveValue('Test Corpus Type Description')
      expect(screen.getByTestId('organisation-select')).toBeInTheDocument()
      expect(screen.getByText('Test Organisation')).toBeInTheDocument()
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

  // describe('Form Validation', () => {
  //   it('shows validation errors for required fields when submitting empty form', async () => {
  //     renderCorpusForm()

  //     fireEvent.click(
  //       screen.getByRole('button', { name: /create new corpus/i }),
  //     )

  //     await waitFor(() => {
  //       expect(screen.getByText(/title is required/i)).toBeInTheDocument()
  //       expect(screen.getByText(/description is required/i)).toBeInTheDocument()
  //       expect(
  //         screen.getByText(/corpus type name is required/i),
  //       ).toBeInTheDocument()
  //       expect(
  //         screen.getByText(/organisation is required/i),
  //       ).toBeInTheDocument()
  //     })
  //   })
  // })

  describe('Form Submission', () => {
    it('successfully creates a new corpus', async () => {
      const mockCreateResponse = { import_id: 'new-id' }
      vi.mocked(createCorpus).mockResolvedValueOnce(mockCreateResponse)

      renderCorpusForm()

      await userEvent.type(screen.getByLabelText(/title/i), 'New Corpus')
      await userEvent.type(
        screen.getByLabelText(/description/i),
        'New Description',
      )

      // Select corpus type
      const corpusTypeSelect = screen.getByTestId('language-select')
      await userEvent.click(corpusTypeSelect)
      await userEvent.click(screen.getByText('Test Type'))

      // Select organisation
      const orgSelect = screen.getByTestId('organisation-select')
      await userEvent.click(orgSelect)
      await userEvent.click(screen.getByText('Test Organisation'))

      fireEvent.click(
        screen.getByRole('button', { name: /create new corpus/i }),
      )

      await waitFor(() => {
        expect(createCorpus).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'New Corpus',
            description: 'New Description',
          }),
        )
        expect(mockNavigate).toHaveBeenCalledWith('/corpora')
      })
    })

    it('successfully updates an existing corpus', async () => {
      const mockCorpus = {
        import_id: 'test-id',
        title: 'Test Corpus',
        description: 'Test Description',
        corpus_type_name: 'Test Type',
        organisation_id: 1,
      }

      vi.mocked(updateCorpus).mockResolvedValueOnce({ success: true })

      renderCorpusForm({ corpus: mockCorpus })

      await userEvent.clear(screen.getByLabelText(/title/i))
      await userEvent.type(screen.getByLabelText(/title/i), 'Updated Corpus')

      fireEvent.click(screen.getByRole('button', { name: /update corpus/i }))

      await waitFor(() => {
        expect(updateCorpus).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Updated Corpus',
          }),
          'test-id',
        )
        expect(mockNavigate).toHaveBeenCalledWith('/corpora')
      })
    })

    it('handles API errors during submission', async () => {
      const error = { message: 'API Error' }
      vi.mocked(createCorpus).mockRejectedValueOnce(error)

      renderCorpusForm()

      await userEvent.type(screen.getByLabelText(/title/i), 'New Corpus')
      await userEvent.type(
        screen.getByLabelText(/description/i),
        'New Description',
      )

      // Select corpus type
      const corpusTypeSelect = screen.getByTestId('language-select')
      await userEvent.click(corpusTypeSelect)
      await userEvent.click(screen.getByText('Test Type'))

      // Select organisation
      const orgSelect = screen.getByTestId('organisation-select')
      await userEvent.click(orgSelect)
      await userEvent.click(screen.getByText('Test Organisation'))

      fireEvent.click(
        screen.getByRole('button', { name: /create new corpus/i }),
      )

      await waitFor(() => {
        expect(screen.getByText(/api error/i)).toBeInTheDocument()
      })
    })
  })

  // describe('Corpus Type Description Modal', () => {
  //   it('shows confirmation modal when updating corpus type description', async () => {
  //     const mockCorpus = {
  //       import_id: 'test-id',
  //       title: 'Test Corpus',
  //       description: 'Test Description',
  //       corpus_type_name: 'Test Type',
  //       corpus_type_description: 'Original Description',
  //       organisation_id: 1,
  //     }

  //     renderCorpusForm({ corpus: mockCorpus })

  //     const descriptionInput = screen.getByLabelText(/corpus type description/i)
  //     await userEvent.clear(descriptionInput)
  //     await userEvent.type(descriptionInput, 'Updated Description')

  //     fireEvent.click(screen.getByRole('button', { name: /update corpus/i }))

  //     expect(screen.getByTestId('modal-body')).toBeInTheDocument()
  //     expect(
  //       screen.getByText(/you have changed the corpus type description/i),
  //     ).toBeInTheDocument()
  //   })

  //   it('proceeds with update after confirming modal', async () => {
  //     const mockCorpus = {
  //       import_id: 'test-id',
  //       title: 'Test Corpus',
  //       description: 'Test Description',
  //       corpus_type_name: 'Test Type',
  //       corpus_type_description: 'Original Description',
  //       organisation_id: 1,
  //     }

  //     vi.mocked(updateCorpus).mockResolvedValueOnce({ success: true })

  //     renderCorpusForm({ corpus: mockCorpus })

  //     const descriptionInput = screen.getByLabelText(/corpus type description/i)
  //     await userEvent.clear(descriptionInput)
  //     await userEvent.type(descriptionInput, 'Updated Description')

  //     fireEvent.click(screen.getByRole('button', { name: /update corpus/i }))
  //     fireEvent.click(screen.getByRole('button', { name: /confirm/i }))

  //     await waitFor(() => {
  //       expect(updateCorpus).toHaveBeenCalledWith(
  //         expect.objectContaining({
  //           corpus_type_description: 'Updated Description',
  //         }),
  //         'test-id',
  //       )
  //     })
  //   })

  //   it('cancels update when dismissing modal', async () => {
  //     const mockCorpus = {
  //       import_id: 'test-id',
  //       title: 'Test Corpus',
  //       description: 'Test Description',
  //       corpus_type_name: 'Test Type',
  //       corpus_type_description: 'Original Description',
  //       organisation_id: 1,
  //     }

  //     renderCorpusForm({ corpus: mockCorpus })

  //     const descriptionInput = screen.getByLabelText(/corpus type description/i)
  //     await userEvent.clear(descriptionInput)
  //     await userEvent.type(descriptionInput, 'Updated Description')

  //     fireEvent.click(screen.getByRole('button', { name: /update corpus/i }))
  //     fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

  //     expect(updateCorpus).not.toHaveBeenCalled()
  //   })
  // })
})
