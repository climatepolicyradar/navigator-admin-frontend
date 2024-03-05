import { customRender } from '@/tests/utilsTest/render'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import FamilyList from '@/components/lists/FamilyList'
import { mockFamiliesData } from '@/tests/utilsTest/mocks'
import { formatDate } from '@/utils/formatDate'

jest.mock('@/api/Families', () => ({
  getFamilies: jest.fn(),
  deleteFamily: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLoaderData: () => ({
    response: { data: mockFamiliesData },
  }),
}))

describe('FamilyList', () => {
  beforeEach(async () => {
    customRender(<FamilyList />)
    await waitFor(() => {
      expect(screen.getByText('UNFCCC Family One')).toBeInTheDocument()
      expect(screen.getByText('CCLW Family Two')).toBeInTheDocument()
    })
  })

  it('renders without crashing', async () => {
    // Verify mock family properties are rendered there
    expect(screen.getByText('UNFCCC Family One')).toBeInTheDocument()
    expect(screen.getByText('Category One')).toBeInTheDocument()
    expect(screen.getByText('Geography One')).toBeInTheDocument()
    expect(screen.getByText(formatDate('1/1/2021'))).toBeInTheDocument()
    expect(screen.getByText(formatDate('2/1/2021'))).toBeInTheDocument()
    expect(screen.getByText(formatDate('3/1/2021'))).toBeInTheDocument()
    expect(screen.getByText(formatDate('4/1/2021'))).toBeInTheDocument()
  })

  it('sorts families by title when title header is clicked', async () => {
    const titleHeader = screen.getByText('Title')

    // Sorted
    fireEvent.click(titleHeader)
    await waitFor(() => {
      const allFamilies = screen.getAllByText(/Family/)
      const indexUNFCCCFamilyOne = allFamilies.findIndex(
        (element) => element.textContent === 'UNFCCC Family One',
      )
      const indexCCLWFamilyTwo = allFamilies.findIndex(
        (element) => element.textContent === 'CCLW Family Two',
      )

      expect(indexUNFCCCFamilyOne).toBeGreaterThan(indexCCLWFamilyTwo)
    })

    // Reversed
    fireEvent.click(titleHeader)
    await waitFor(() => {
      const allFamilies = screen.getAllByText(/Family/)
      const indexUNFCCCFamilyOne = allFamilies.findIndex(
        (element) => element.textContent === 'UNFCCC Family One',
      )
      const indexCCLWFamilyTwo = allFamilies.findIndex(
        (element) => element.textContent === 'CCLW Family Two',
      )

      expect(indexUNFCCCFamilyOne).toBeLessThan(indexCCLWFamilyTwo)
    })
  })
})
