import { customRender } from '@/tests/utilsTest/render'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import '@testing-library/jest-dom'

import FamilyList from '@/components/lists/FamilyList'
import { mockFamiliesData } from '@/tests/utilsTest/mocks'

jest.mock('@/api/Families', () => ({
  getFamilies: jest.fn(),
  deleteFamily: jest.fn(),
}))

jest.mock('react-router-dom', (): unknown => ({
  ...jest.requireActual('react-router-dom'),
  useLoaderData: () => ({
    response: { data: mockFamiliesData },
  }),
}))

describe('FamilyList', () => {
  beforeEach(async () => {
    customRender(<FamilyList />)
    await waitFor(() => {
      expect(screen.getByText(mockFamiliesData[0].title)).toBeInTheDocument()
    })
  })

  it('renders without crashing', () => {
    // Verify mock family properties are rendered there
    expect(screen.queryAllByText(mockFamiliesData[0].title)).not.toHaveLength(0)
    expect(
      screen.queryAllByText(mockFamiliesData[0].category),
    ).not.toHaveLength(0)
    expect(
      screen.queryAllByText(mockFamiliesData[0].geography),
    ).not.toHaveLength(0)
    expect(
      screen.queryAllByText(mockFamiliesData[0].published_date),
    ).not.toHaveLength(0)
    expect(
      screen.queryAllByText(mockFamiliesData[0].last_updated_date),
    ).not.toHaveLength(0)
    expect(screen.queryAllByText(mockFamiliesData[0].created)).not.toHaveLength(
      0,
    )
    expect(
      screen.queryAllByText(mockFamiliesData[0].last_modified),
    ).not.toHaveLength(0)
  })

  it('sorts families by title when title header is clicked', async () => {
    expect(screen.getByText(mockFamiliesData[0].title)).toBeInTheDocument()
    const titleHeader = screen.getByText('Title')

    // Sorted
    fireEvent.click(titleHeader)
    await waitFor(() => {
      const allFamilies = screen.getAllByText(/Family/)

      const indexFamilyOne = allFamilies.findIndex(
        (element) => element.textContent === mockFamiliesData[1].title,
      )
      const indexFamilyTwo = allFamilies.findIndex(
        (element) => element.textContent === mockFamiliesData[0].title,
      )

      expect(indexFamilyOne).toBeLessThan(indexFamilyTwo)
    })

    // Reversed
    fireEvent.click(titleHeader)
    await waitFor(() => {
      const allFamilies = screen.getAllByText(/Family/)

      const indexFamilyOne = allFamilies.findIndex(
        (element) => element.textContent === mockFamiliesData[1].title,
      )
      const indexFamilyTwo = allFamilies.findIndex(
        (element) => element.textContent === mockFamiliesData[0].title,
      )

      expect(indexFamilyOne).toBeGreaterThan(indexFamilyTwo)
    })
  })

  it('shows a warning icon only for families without documents or events', async () => {
    const familyIdWithoutDocumentsAndEvents = mockFamiliesData[2].import_id
    const familyIdWithoutDocuments = mockFamiliesData[3].import_id
    const familyIdWithoutEvents = mockFamiliesData[4].import_id
    const familyIdWithDocumentsAndEvents = mockFamiliesData[0].import_id
    await waitFor(() => {
      const familyRowWithoutDocumentsAndEvents = within(
        screen.getByTestId(`family-row-${familyIdWithoutDocumentsAndEvents}`),
      )
      const familyRowWithoutDocuments = within(
        screen.getByTestId(`family-row-${familyIdWithoutDocuments}`),
      )
      const familyRowWithoutEvents = within(
        screen.getByTestId(`family-row-${familyIdWithoutEvents}`),
      )
      const familyRowWithDocumentsAndEvents = within(
        screen.getByTestId(`family-row-${familyIdWithDocumentsAndEvents}`),
      )

      expect(familyRowWithoutDocumentsAndEvents.queryByTestId('warning-icon')).toBeInTheDocument()
      expect(familyRowWithoutDocuments.queryByTestId('warning-icon')).toBeInTheDocument()
      expect(
        familyRowWithoutEvents.queryByTestId('warning-icon'),
      ).toBeInTheDocument()
      expect(
        familyRowWithDocumentsAndEvents.queryByTestId('warning-icon'),
      ).not.toBeInTheDocument()
    })
  })
})
