import { FamilyEventList } from '@/components/lists/FamilyEventList'
import { render, screen } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import { mockFamiliesData } from '@/tests/utilsTest/mocks'

vi.mock('@/hooks/useEvent', () => ({
  default: vi.fn().mockReturnValue({
    event: {
      date: '11/07/2024',
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
      />,
    )

    expect(screen.getByText('Events')).toBeInTheDocument()
    expect(screen.getByText('Test event title')).toBeInTheDocument()
    expect(screen.getByText('Type: Appealed')).toBeInTheDocument()
    expect(screen.getByText('Date: 11/7/2024')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Edit' })).toHaveLength(2)
  })
})
