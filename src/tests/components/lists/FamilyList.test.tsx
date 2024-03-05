import { customRender } from '@/tests/utilsTest/render'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import FamilyList from '@/components/lists/FamilyList'

jest.mock('@/api/Families', () => ({
  getFamilies: jest.fn(),
  deleteFamily: jest.fn(),
}))

const mockFamiliesData = [
  {
    import_id: '1',
    title: 'Family One',
    category: 'Category One',
    geography: 'Geography One',
    published_date: '1/1/2021',
    last_updated_date: '2/1/2021',
    last_modified: '3/1/2021',
    created: '4/1/2021',
    status: 'active',
  },
  {
    import_id: '2',
    title: 'Family Two',
    category: 'Category Two',
    geography: 'Geography Two',
    published_date: '1/2/2021',
    last_updated_date: '2/2/2021',
    last_modified: '3/2/2021',
    created: '4/2/2021',
    status: 'active',
  },
]

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
      expect(screen.getByText('Family One')).toBeInTheDocument()
    })
  })

  it('renders without crashing', () => {
    // Verify mock family properties are rendered there
    expect(screen.getByText('Family One')).toBeInTheDocument()
    expect(screen.getByText('Category One')).toBeInTheDocument()
    expect(screen.getByText('Geography One')).toBeInTheDocument()
    expect(screen.getByText('1/1/2021')).toBeInTheDocument()
    expect(screen.getByText('2/1/2021')).toBeInTheDocument()
    expect(screen.getByText('3/1/2021')).toBeInTheDocument()
    expect(screen.getByText('4/1/2021')).toBeInTheDocument()
  })

  it('sorts families by title when title header is clicked', async () => {
    expect(screen.getByText('Family One')).toBeInTheDocument()
    const titleHeader = screen.getByText('Title')

    // Sorted
    fireEvent.click(titleHeader)
    await waitFor(() => {
      const allFamilies = screen.getAllByText(/Family/)

      const indexFamilyOne = allFamilies.findIndex(
        (element) => element.textContent === 'Family One',
      )
      const indexFamilyTwo = allFamilies.findIndex(
        (element) => element.textContent === 'Family Two',
      )

      expect(indexFamilyOne).toBeLessThan(indexFamilyTwo)
    })

    // Reversed
    fireEvent.click(titleHeader)
    await waitFor(() => {
      const allFamilies = screen.getAllByText(/Family/)

      const indexFamilyOne = allFamilies.findIndex(
        (element) => element.textContent === 'Family One',
      )
      const indexFamilyTwo = allFamilies.findIndex(
        (element) => element.textContent === 'Family Two',
      )

      expect(indexFamilyOne).toBeGreaterThan(indexFamilyTwo)
    })
  })
})
