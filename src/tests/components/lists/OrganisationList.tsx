import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import '../../setup'
import { IOrganisation } from '@/interfaces/Organisation'
import { TestWrapper } from '@/tests/utilsTest/render'
import '@testing-library/jest-dom'
import OrganisationList from '@/components/lists/OrganisationList'
import useOrganisations from '@/hooks/useOrganisations'

// Mock data needs to be defined before imports for vi.mock hoisting
const mockOrganisations: IOrganisation[] = [
  {
    id: 1,
    internal_name: 'Test Organisation 1',
    display_name: 'Test Organisation 1',
    description: 'Test Description 1',
    type: 'TES',
  },
  {
    id: 2,
    internal_name: 'Test Organisation 2',
    display_name: 'Test Organisation 2',
    description: 'Test Description 2',
    type: 'TES',
  },
] as const

const mockUseOrganisations = useOrganisations as unknown as ReturnType<
  typeof vi.fn
>

// Mock modules before imports
vi.mock('@/hooks/useOrganisations', () => ({
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
      <OrganisationList />
    </TestWrapper>,
  )
}

describe('CorpusList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseOrganisations.mockReturnValue({
      organisations: mockOrganisations,
      loading: false,
      error: null,
    })
  })

  it('renders list of organisations', () => {
    renderComponent()
    expect(screen.getByText('Test Organisation 1')).toBeInTheDocument()
    expect(screen.getByText('Test Organisation 2')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    mockUseOrganisations.mockReturnValue({
      organisations: [],
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
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
  })

  it('displays organisation data in correct columns', () => {
    renderComponent()

    // Get all rows (excluding header)
    const rows = screen.getAllByRole('row').slice(1)

    // Check first corpus row
    const firstRowCells = rows[0].querySelectorAll('td')
    expect(firstRowCells[0]).toHaveTextContent(
      mockOrganisations[0].display_name,
    )
    expect(firstRowCells[1]).toHaveTextContent(
      mockOrganisations[0].description || '',
    )
    expect(firstRowCells[2]).toHaveTextContent(mockOrganisations[0].type)

    // Check second corpus row
    const secondRowCells = rows[1].querySelectorAll('td')
    expect(secondRowCells[0]).toHaveTextContent(
      mockOrganisations[1].display_name,
    )
    expect(secondRowCells[1]).toHaveTextContent(
      mockOrganisations[1].description || '',
    )
    expect(secondRowCells[2]).toHaveTextContent(mockOrganisations[1].type)

    // Check edit buttons
    const editButtons = screen.getAllByRole('button', {
      name: /edit organisation/i,
    })
    expect(editButtons).toHaveLength(mockOrganisations.length)

    // Verify each edit button has the correct link
    editButtons.forEach((button, index) => {
      const link = button.closest('a')
      expect(link).toHaveAttribute(
        'href',
        `/organisation/${mockOrganisations[index].id}/edit`,
      )
    })
  })

  it('shows error state', () => {
    mockUseOrganisations.mockReturnValue({
      organisations: [],
      loading: false,
      error: new Error('Test error'),
      reload: vi.fn(),
    } as const)

    renderComponent()
    expect(screen.getByText(/error/i)).toBeInTheDocument()
  })

  it('navigates to edit organisation page on edit button click', () => {
    renderComponent()

    const editButtons = screen.getAllByRole('button', {
      name: /edit organisation/i,
    })
    const firstEditButton = editButtons[0]
    const link = firstEditButton.closest('a')

    expect(link).toHaveAttribute(
      'href',
      `/organisation/${mockOrganisations[0].id}/edit`,
    )
  })
})
