import { customRender } from '@/tests/utilsTest/render'
import { screen, within } from '@testing-library/react'
import FamilyList from '@/components/lists/FamilyList'
import { mockFamiliesData } from '@/tests/utilsTest/mocks'
import { formatDate } from '@/utils/formatDate'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

vi.mock('@/api/Families', () => ({
  getFamilies: vi.fn(),
  deleteFamily: vi.fn(),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: unknown = await importOriginal()
  return {
    ...(actual as Record<string, unknown>),
    useLoaderData: () => ({
      response: { data: mockFamiliesData },
    }),
  }
})

const UNFCCCFamily = mockFamiliesData[0]
const mockCCLWFamily = mockFamiliesData[1]

describe('FamilyList', () => {
  it('renders without crashing', async () => {
    customRender(<FamilyList />)
    // Verify expected family properties are rendered there
    expect(await screen.findAllByText(UNFCCCFamily.title)).toHaveLength(1)
    expect(screen.getAllByText(UNFCCCFamily.category)).toHaveLength(2)
    expect(screen.getAllByText(UNFCCCFamily.geography)).toHaveLength(2)

    // We put the formatDate here so that the formatting runs in the same locale
    // as the component when it runs formatDate.
    expect(
      screen.getAllByText(formatDate(UNFCCCFamily.published_date)),
    ).toHaveLength(1)
    expect(
      screen.getAllByText(formatDate(UNFCCCFamily.last_updated_date)),
    ).toHaveLength(1)
    expect(screen.getAllByText(formatDate(UNFCCCFamily.created))).toHaveLength(
      1,
    )
    expect(
      screen.getAllByText(formatDate(UNFCCCFamily.last_modified)),
    ).toHaveLength(1)
  })

  it('sorts families by title when title header is clicked', async () => {
    customRender(<FamilyList />)

    const titleHeader = screen.getByText('Title')

    // Sorted
    await userEvent.click(titleHeader)

    const sortedFamilies = screen.getAllByText(/Family/)

    const indexSortedFamilyOne = sortedFamilies.findIndex(
      (element) => element.textContent === mockCCLWFamily.title,
    )
    const indexSortedFamilyTwo = sortedFamilies.findIndex(
      (element) => element.textContent === UNFCCCFamily.title,
    )

    expect(indexSortedFamilyOne).toBeLessThan(indexSortedFamilyTwo)
    // Reversed
    await userEvent.click(titleHeader)

    const unsortedFamilies = screen.getAllByText(/Family/)

    const indexUnsortedFamilyOne = unsortedFamilies.findIndex(
      (element) => element.textContent === mockCCLWFamily.title,
    )
    const indexUnsortedFamilyTwo = unsortedFamilies.findIndex(
      (element) => element.textContent === UNFCCCFamily.title,
    )

    expect(indexUnsortedFamilyOne).toBeGreaterThan(indexUnsortedFamilyTwo)
  })

  it('shows a warning icon only for families without documents or events', async () => {
    customRender(<FamilyList />)

    const familyIdWithoutDocumentsAndEvents = mockFamiliesData[2].import_id
    const familyIdWithoutDocuments = mockFamiliesData[3].import_id
    const familyIdWithoutEvents = mockFamiliesData[4].import_id
    const familyIdWithDocumentsAndEvents = UNFCCCFamily.import_id
    const familyRowWithoutDocumentsAndEvents = within(
      await screen.findByTestId(
        `family-row-${familyIdWithoutDocumentsAndEvents}`,
      ),
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

    expect(
      familyRowWithoutDocumentsAndEvents.getByTestId('warning-icon'),
    ).toBeInTheDocument()
    expect(
      familyRowWithoutDocuments.getByTestId('warning-icon'),
    ).toBeInTheDocument()
    expect(
      familyRowWithoutEvents.getByTestId('warning-icon'),
    ).toBeInTheDocument()
    expect(
      familyRowWithDocumentsAndEvents.queryByTestId('warning-icon'),
    ).not.toBeInTheDocument()
  })

  it('shows N/A when there is no value for a published date and last updated date in a family document', () => {
    customRender(<FamilyList />)

    const familyIdWithoutEvents = mockFamiliesData[4].import_id
    const rowWithoutEventElement = screen.getByTestId(
      `family-row-${familyIdWithoutEvents}`,
    )
    const nonApplicableDatesNoEvents = within(
      rowWithoutEventElement,
    ).getAllByText('N/A')
    expect(nonApplicableDatesNoEvents).toHaveLength(2)

    const familyIdWithoutDocumentsAndEvents = mockFamiliesData[2].import_id
    const rowWithoutEventAndDocumentElement = screen.getByTestId(
      `family-row-${familyIdWithoutDocumentsAndEvents}`,
    )

    const nonApplicableDatesNoEventsAndDocuments = within(
      rowWithoutEventAndDocumentElement,
    ).getAllByText('N/A')
    expect(nonApplicableDatesNoEventsAndDocuments).toHaveLength(2)
  })
})
