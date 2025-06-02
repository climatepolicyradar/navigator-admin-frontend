import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { EventSection } from '@/components/forms/sections/EventSection'
import { mockEvent } from '@/tests/utilsTest/mocks'
import { formatDate } from '@/utils/formatDate'

// Mock the useEvent hook
vi.mock('@/hooks/useEvent', () => ({
  default: vi.fn().mockReturnValue({
    event: {
      date: mockEvent.date,
      event_title: 'Some event title',
      event_type_value: 'Appealed',
    },
    error: null,
    loading: false,
  }),
}))

describe('EventSection', () => {
  const mockOnAddNew = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()
  const mockSetUpdatedEvent = vi.fn()

  const defaultProps = {
    familyEvents: ['test-event-1'],
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
  })

  it('renders existing family events', () => {
    render(<EventSection {...defaultProps} />)

    const formattedDate = formatDate(mockEvent.date)

    expect(screen.getByText('Events')).toBeInTheDocument()
    expect(screen.getByText('Some event title')).toBeInTheDocument()
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

    expect(
      screen.getByText(
        'Please create the family first before attempting to add events',
      ),
    ).toBeInTheDocument()
    expect(screen.queryByText('Add new Event')).not.toBeInTheDocument()
  })

  it('shows warning icon when no events exist', () => {
    render(<EventSection {...defaultProps} familyEvents={[]} />)

    const addButton = screen.getByText('Add new Event')
    const warningIcon = addButton.querySelector(
      'svg[data-test-id="warning-icon-event"]',
    )
    expect(warningIcon).toBeInTheDocument()
  })

  it('disables add event button when user cannot modify', () => {
    render(<EventSection {...defaultProps} userCanModify={false} />)

    const addButton = screen.getByText('Add new Event')
    expect(addButton).toBeDisabled()
  })
})
