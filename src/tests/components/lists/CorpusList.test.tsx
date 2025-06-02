import '@testing-library/jest-dom'
import { screen, render } from '@testing-library/react'
import { vi } from 'vitest'

import CorpusList from '@/components/lists/CorpusList'
import { ICorpus } from '@/interfaces/Corpus'
import { TestWrapper } from '@/tests/utilsTest/render'

// Mock data needs to be defined before imports for vi.mock hoisting
const mockCorpora: ICorpus[] = [
  {
    import_id: 'test-corpus-1',
    title: 'Test Corpus 1',
    description: 'Test Description 1',
    corpus_text: '<p>Test Content 1</p>',
    corpus_image_url: 'https://example.com/image1.jpg',
    corpus_type_name: 'test_type',
    corpus_type_description: 'Test Type Description',
    organisation_id: 1,
    organisation_name: 'Test Organisation',
  },
  {
    import_id: 'test-corpus-2',
    title: 'Test Corpus 2',
    description: 'Test Description 2',
    corpus_text: '<p>Test Content 2</p>',
    corpus_image_url: 'https://example.com/image2.jpg',
    corpus_type_name: 'test_type',
    corpus_type_description: 'Test Type Description',
    organisation_id: 1,
    organisation_name: 'Test Organisation',
  },
] as const

const mockUseCorpora = vi.fn()

// Mock modules before imports
vi.mock('@/hooks/useCorpora', () => ({
  // TODO: Remove this ignore.
  default: () => mockUseCorpora(),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...(actual as object), useNavigate: () => vi.fn() }
})

const renderComponent = () => {
  return render(
    <TestWrapper>
      <CorpusList />
    </TestWrapper>,
  )
}

describe('CorpusList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseCorpora.mockReturnValue({
      corpora: mockCorpora,
      loading: false,
      error: null,
      reload: vi.fn(),
    } as const)
  })

  it('renders list of corpora', () => {
    renderComponent()
    expect(screen.getByText('Test Corpus 1')).toBeInTheDocument()
    expect(screen.getByText('Test Corpus 2')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    mockUseCorpora.mockReturnValue({
      corpora: [],
      loading: true,
      error: null,
      reload: vi.fn(),
    } as const)

    renderComponent()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('displays correct table headings', () => {
    renderComponent()

    // Check total number of headings
    const headings = screen.getAllByRole('columnheader')
    expect(headings).toHaveLength(4)

    // Check specific heading text
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Organisation')).toBeInTheDocument()
    expect(screen.getByText('Corpus Type')).toBeInTheDocument()
  })

  it('displays corpus data in correct columns', () => {
    renderComponent()

    // Get all rows (excluding header)
    const rows = screen.getAllByRole('row').slice(1)

    // Check first corpus row
    const firstRowCells = rows[0].querySelectorAll('td')
    expect(firstRowCells[0]).toHaveTextContent(mockCorpora[0].title)
    expect(firstRowCells[1]).toHaveTextContent(
      mockCorpora[0].organisation_name || '',
    )
    expect(firstRowCells[2]).toHaveTextContent(
      mockCorpora[0].corpus_type_name || '',
    )

    // Check second corpus row
    const secondRowCells = rows[1].querySelectorAll('td')
    expect(secondRowCells[0]).toHaveTextContent(mockCorpora[1].title)
    expect(secondRowCells[1]).toHaveTextContent(
      mockCorpora[1].organisation_name || '',
    )
    expect(secondRowCells[2]).toHaveTextContent(
      mockCorpora[1].corpus_type_name || '',
    )

    // Check edit buttons
    const editButtons = screen.getAllByRole('button', { name: /edit corpus/i })
    expect(editButtons).toHaveLength(mockCorpora.length)

    // Verify each edit button has the correct link
    editButtons.forEach((button, index) => {
      const link = button.closest('a')
      expect(link).toHaveAttribute(
        'href',
        `/corpus/${mockCorpora[index].import_id}/edit`,
      )
    })
  })

  it('shows error state', () => {
    mockUseCorpora.mockReturnValue({
      corpora: [],
      loading: false,
      error: new Error('Test error'),
      reload: vi.fn(),
    } as const)

    renderComponent()
    expect(screen.getByText(/error/i)).toBeInTheDocument()
  })

  it('shows empty state when no corpora', () => {
    mockUseCorpora.mockReturnValue({
      corpora: [],
      loading: false,
      error: null,
      reload: vi.fn(),
    } as const)

    renderComponent()
    expect(screen.getByText(/no results found/i)).toBeInTheDocument()
  })

  it('navigates to edit corpus page on edit button click', () => {
    renderComponent()

    const editButtons = screen.getAllByRole('button', { name: /edit corpus/i })
    const firstEditButton = editButtons[0]
    const link = firstEditButton.closest('a')

    expect(link).toHaveAttribute(
      'href',
      `/corpus/${mockCorpora[0].import_id}/edit`,
    )
  })
})
