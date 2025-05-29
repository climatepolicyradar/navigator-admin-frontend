import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { EventEditDrawer } from '@/components/drawers/EventEditDrawer'
import { formatDate } from '@/utils/formatDate'
import userEvent from '@testing-library/user-event'
import { TTaxonomy } from '@/interfaces'

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

  it('renders create new event form if an editingEvent is not passed in', async () => {
    render(
      <EventEditDrawer
        familyId={'1'}
        onClose={() => {}}
        isOpen={true}
        onSuccess={() => {}}
        canModify={false}
        taxonomy={
          {
            _event: {
              event_type: {
                allowed_values: ['Test event type'],
                allow_any: false,
                allow_blanks: false,
              },
            },
          } as TTaxonomy
        }
      />,
    )
    expect(screen.getByText('Add new Event')).toBeInTheDocument()

    expect(screen.getByText('Select event type')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('combobox', { name: 'Event Type' }))
    expect(
      screen.getByRole('option', {
        name: 'Test event type',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Create New Event' }),
    ).toBeInTheDocument()
  })
})
