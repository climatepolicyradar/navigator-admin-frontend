import { EventEditDrawer } from '@/components/drawers/EventEditDrawer'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('EventEditDrawer', () => {
  it('renders edit form for existing event if an editingEvent is passed in', () => {
    const editingEvent = {
      import_id: '1',
      event_title: 'Test event title',
      date: '11/7/2024',
      event_type_value: 'Appealed',
      event_status: 'Submitted',
      family_import_id: '1',
    }
    render(
      <EventEditDrawer
        editingEvent={editingEvent}
        loadedFamilyId='1'
        canModify={true}
        onClose={() => {}}
        isOpen={true}
      />,
    )
    expect(
      screen.getByText(
        `Edit: ${editingEvent.event_title}, on ${editingEvent.date}`,
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Update Event' }),
    ).toBeInTheDocument()
  })

  it('renders create new event form if an editingEvent is not passed in', () => {
    render(
      <EventEditDrawer
        loadedFamilyId='1'
        canModify={true}
        onClose={() => {}}
        isOpen={true}
      />,
    )
    expect(screen.getByText('Add new Event')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Create new Event' }),
    ).toBeInTheDocument()
  })
})
