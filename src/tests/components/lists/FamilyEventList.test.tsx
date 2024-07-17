import { FamilyEventList } from '@/components/lists/FamilyEventList'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { mockFamiliesData } from '@/tests/utilsTest/mocks'

jest.mock('@/api', () => ({
  getApiUrl: jest.fn().mockReturnValue('http://mock-api-url'),
}))

jest.mock('@/hooks/useEvent', () =>
  jest.fn().mockReturnValue({
    event: {
      date: '11/07/2024',
      event_title: 'Test event title',
      event_type_value: 'Appealed',
    },
    error: null,
    loading: false,
  }),
)

describe('FamilyEventList', () => {
  it('renders existing family events', () => {
    render(
      <FamilyEventList
        familyEvents={['test-event']}
        canModify={() => true}
        orgName='Test org'
        isSuperUser={false}
        userAccess={{}}
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
