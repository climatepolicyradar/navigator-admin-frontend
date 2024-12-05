import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { mockEvent, mockFamiliesData } from '@/tests/utilsTest/mocks'
import { EventSection } from '@/components/forms/sections/EventSection'
import { formatDate } from '@/utils/formatDate'
import { deleteEvent } from '@/api/Events'

// Mock the API
vi.mock('@/api/Events', () => ({
  deleteEvent: vi.fn(),
}))

// Mock the useEvent hook
vi.mock('@/hooks/useEvent', () => ({
  default: vi.fn().mockReturnValue({
    event: {
      date: mockEvent.date,
      event_title: 'Test event title',
      event_type_value: 'Appealed',
    },
    error: null,
    loading: false,
  }),
}))

// Mock the FamilyEvent component
vi.mock('@/components/family/FamilyEvent', () => ({
  FamilyEvent: ({ eventId, onEditClick, onDeleteClick }: any) => (
    <div data-testid={`family-event-${eventId}`}>
      <div>Test event title</div>
      <div>Type: Appealed</div>
      <div>Date: {formatDate(mockEvent.date)}</div>
      <button onClick={() => onEditClick(mockEvent)}>Edit</button>
      <button onClick={() => onDeleteClick(eventId)}>Delete</button>
    </div>
  ),
}))

describe('EventSection', () => {
  const mockOnAddNew = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()
  const mockSetUpdatedEvent = vi.fn()
  const mockSetFamilyEvents = vi.fn()

  const defaultProps = {
    familyEvents: ['test-event-1', 'test-event-2'],
    userCanModify: true,
    onAddNew: mockOnAddNew,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    updatedEvent: '',
    setUpdatedEvent: mockSetUpdatedEvent,
    isNewFamily: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(deleteEvent as jest.Mock).mockClear()
  })

  it('renders existing family events', () => {
    render(<EventSection {...defaultProps} />)

    const formattedDate = formatDate(mockEvent.date)

    expect(screen.getByText('Events')).toBeInTheDocument()
    expect(screen.getByText('Test event title')).toBeInTheDocument()
    expect(screen.getByText('Type: Appealed')).toBeInTheDocument()
    expect(screen.getByText(`Date: ${formattedDate}`)).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Edit' })).toHaveLength(2)
  })

  it('renders add event button for existing family', () => {
    render(<EventSection {...defaultProps} />)

    expect(screen.getByText('Add new Event')).toBeInTheDocument()
  })

  it('does not render add event button for new family', () => {
    render(<EventSection {...defaultProps} isNewFamily={true} />)

    expect(screen.getByText('Please create the family first before attempting to add events')).toBeInTheDocument()
    expect(screen.queryByText('Add new Event')).not.toBeInTheDocument()
  })

  it('shows warning icon when no events exist', () => {
    render(<EventSection {...defaultProps} familyEvents={[]} />)

    const addButton = screen.getByText('Add new Event')
    expect(addButton).toHaveAttribute('data-test-id', 'warning-icon-event')
  })

  it('calls onAddNew when add event button is clicked', () => {
    render(<EventSection {...defaultProps} />)

    fireEvent.click(screen.getByText('Add new Event'))
    expect(mockOnAddNew).toHaveBeenCalledWith('event')
  })

  it('calls onEdit when edit button is clicked', () => {
    render(<EventSection {...defaultProps} />)

    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])
    expect(mockOnEdit).toHaveBeenCalledWith('event', mockEvent)
  })

  it('calls onDelete when delete button is clicked', async () => {
    // Mock successful deletion
    ;(deleteEvent as jest.Mock).mockResolvedValue({})

    const familyEvents = ['test-event-1', 'test-event-2']
    const props = {
      ...defaultProps,
      familyEvents,
      setFamilyEvents: mockSetFamilyEvents,
    }

    render(<EventSection {...props} />)

    const deleteButtons = screen.getAllByText('Delete')
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(deleteEvent).toHaveBeenCalledWith('test-event-1')
      expect(mockSetFamilyEvents).toHaveBeenCalledWith(['test-event-2'])
    })
  })

  it('handles delete error', async () => {
    // Mock failed deletion
    const mockError = new Error('Deletion failed')
    ;(deleteEvent as jest.Mock).mockRejectedValue(mockError)

    const familyEvents = ['test-event-1', 'test-event-2']
    const props = {
      ...defaultProps,
      familyEvents,
      setFamilyEvents: mockSetFamilyEvents,
    }

    render(<EventSection {...props} />)

    const deleteButtons = screen.getAllByText('Delete')
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(deleteEvent).toHaveBeenCalledWith('test-event-1')
      expect(mockSetFamilyEvents).not.toHaveBeenCalled()
    })
  })

  it('disables add event button when user cannot modify', () => {
    render(<EventSection {...defaultProps} userCanModify={false} />)

    const addButton = screen.getByText('Add new Event')
    expect(addButton).toBeDisabled()
  })
})
