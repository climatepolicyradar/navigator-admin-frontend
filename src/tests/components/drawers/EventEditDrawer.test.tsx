import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { EventEditDrawer } from '@/components/drawers/EventEditDrawer'
import { formatDate } from '@/utils/formatDate'

describe('EventEditDrawer', () => {
  it('renders edit form for existing event if an editingEvent is passed in', () => {
    const eventDate = new Date(2024, 6, 11).toISOString()
    // We put the formattedDate here so that the formatting runs in the same locale
    // as the test suite component when it runs formatDate.
    const formattedDate = formatDate(eventDate)

    const editingEvent = {
      import_id: '1',
      event_title: 'Test event title',
      date: eventDate,
      event_type_value: 'Appealed',
      event_status: 'Submitted',
      family_import_id: '1',
    }
    render(
      <EventEditDrawer
        event={editingEvent}
        onClose={() => {}}
        isOpen={true}
        canModify={true}
        familyId={'1'}
      />,
    )
    expect(
      screen.getByText(
        `Edit: ${editingEvent.event_title}, on ${formattedDate}`,
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Update Event' }),
    ).toBeInTheDocument()
  })

  it('renders create new event form if an editingEvent is not passed in', () => {
    render(
      <EventEditDrawer
        onClose={() => {}}
        isOpen={true}
        familyId={'1'}
        canModify={true}
        onSuccess={() => {}}
      />,
    )
    expect(screen.getByText('Add new Event')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Create New Event' }),
    ).toBeInTheDocument()
  })
})
