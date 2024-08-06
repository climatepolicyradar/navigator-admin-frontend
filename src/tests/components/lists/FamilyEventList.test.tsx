import { render, screen } from '@testing-library/react'
import { mockEvent, mockFamiliesData } from '@/tests/utilsTest/mocks'

import { FamilyEventList } from '@/components/lists/FamilyEventList'
import { formatDate } from '@/utils/formatDate'

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

describe('FamilyEventList', () => {
  it('renders existing family events', () => {
    render(
      <FamilyEventList
        familyEvents={['test-event']}
        canModify={true}
        onEditEntityClick={() => {}}
        onAddNewEntityClick={() => {}}
        setFamilyEvents={() => {}}
        loadedFamily={mockFamiliesData[0]}
        updatedEvent={''}
        setUpdatedEvent={() => {}}
      />,
    )

    // We put the formattedDate here so that the formatting runs in the same locale
    // as the test suite component when it runs formatDate.
    const formattedDate = formatDate(mockEvent.date)

    expect(screen.getByText('Events')).toBeInTheDocument()
    expect(screen.getByText('Test event title')).toBeInTheDocument()
    expect(screen.getByText('Type: Appealed')).toBeInTheDocument()
    expect(screen.getByText(`Date: ${formattedDate}`)).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Edit' })).toHaveLength(2)
  })
})
