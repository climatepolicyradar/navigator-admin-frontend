import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import useCorpusTypes from '@/hooks/useCorpusTypes'
import '../../setup'
import { ICorpusType } from '@/interfaces/CorpusType'
import { TestWrapper } from '@/tests/utilsTest/render'
import '@testing-library/jest-dom'
import CorpusTypeList from '@/components/lists/CorpusTypeList'

// Mock data needs to be defined before imports for vi.mock hoisting
const mockCorpusTypes: ICorpusType[] = [
  {
    name: 'Test Corpus Type 1',
    description: 'Test Type Description 1',
  },
  {
    name: 'Test Corpus Type 2',
    description: 'Test Type Description 2',
  },
] as const

const mockUseCorpusTypes = useCorpusTypes as unknown as ReturnType<typeof vi.fn>

// Mock modules before imports
vi.mock('@/hooks/useCorpusTypes', () => ({
  default: vi.fn(),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(actual as object),
    useNavigate: () => vi.fn(),
  }
})

const renderComponent = () => {
  return render(
    <TestWrapper>
      <CorpusTypeList />
    </TestWrapper>,
  )
}

describe('CorpusList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseCorpusTypes.mockReturnValue({
      corpusTypes: mockCorpusTypes,
      loading: false,
      error: null,
    })
  })

  it('renders list of corpus types', () => {
    renderComponent()
    expect(screen.getByText('Test Corpus Type 1')).toBeInTheDocument()
    expect(screen.getByText('Test Corpus Type 2')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    mockUseCorpusTypes.mockReturnValue({
      corpusTypes: [],
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
    expect(headings).toHaveLength(3)

    // Check specific heading text
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('displays corpus type data in correct columns', () => {
    renderComponent()

    // Get all rows (excluding header)
    const rows = screen.getAllByRole('row').slice(1)

    // Check first corpus row
    const firstRowCells = rows[0].querySelectorAll('td')
    expect(firstRowCells[0]).toHaveTextContent(mockCorpusTypes[0].name)
    expect(firstRowCells[1]).toHaveTextContent(
      mockCorpusTypes[0].description || '',
    )

    // Check second corpus row
    const secondRowCells = rows[1].querySelectorAll('td')
    expect(secondRowCells[0]).toHaveTextContent(mockCorpusTypes[1].name)
    expect(secondRowCells[1]).toHaveTextContent(
      mockCorpusTypes[1].description || '',
    )

    // Check edit buttons
    const editButtons = screen.getAllByRole('button', {
      name: /edit corpus type/i,
    })
    expect(editButtons).toHaveLength(mockCorpusTypes.length)

    // Verify each edit button has the correct link
    editButtons.forEach((button, index) => {
      const link = button.closest('a')
      expect(link).toHaveAttribute(
        'href',
        `/corpus-type/${mockCorpusTypes[index].name}/edit`,
      )
    })
  })

  it('shows error state', () => {
    mockUseCorpusTypes.mockReturnValue({
      corpusTypes: [],
      loading: false,
      error: new Error('Test error'),
      reload: vi.fn(),
    } as const)

    renderComponent()
    expect(screen.getByText(/error/i)).toBeInTheDocument()
  })

  it('navigates to edit corpus type page on edit button click', () => {
    renderComponent()

    const editButtons = screen.getAllByRole('button', {
      name: /edit corpus type/i,
    })
    const firstEditButton = editButtons[0]
    const link = firstEditButton.closest('a')

    expect(link).toHaveAttribute(
      'href',
      `/corpus-type/${mockCorpusTypes[0].name}/edit`,
    )
  })
})
