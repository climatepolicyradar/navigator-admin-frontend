import { screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import { mockCollections, mockFamiliesData } from '@/tests/utilsTest/mocks'
import { customRender } from '@/tests/utilsTest/render'

import { FamilyForm } from '@/components/forms/FamilyForm'
import { act } from 'react-dom/test-utils'

// useBlocker only can be used in a router context
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useBlocker: jest.fn(),
}))

// API calls
jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      get: jest.fn(),
      defaults: {
        headers: {
          common: {},
        },
      },
    })),
  }
})

jest.mock('@/api', () => ({
  getApiUrl: jest.fn().mockReturnValue('http://mock-api-url'),
}))

// const useCollectionsMock = jest.fn((query: string) => {
//   console.log("QUERY")
//   console.log(query)
//   return { collections: [], error: null, loading: false, reload: jest.fn()}
// })

// jest.mock('@/hooks/useCollections', () => ({
//   __esModule: true,
//   default: useCollectionsMock,
// }))

jest.mock('@/hooks/useCollections', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((query: string) => {
    console.log('QUERY')
    console.log(query)
    return {
      collections: mockCollections,
      error: null,
      loading: false,
      reload: jest.fn(),
    }
  }),
}))

let mockFamilyData = mockFamiliesData[0]

describe('FamilyList', () => {
  it('renders family data', async () => {
    act(() => {
      customRender(<FamilyForm family={mockFamilyData} />)
    })

    await waitFor(() => {
      console.log(screen.debug())
      // expect(screen.getByText(mockFamilyData.title)).toBeInTheDocument()
    })
  })
})

// TEST: isDirty & external navigation & internal navigation

// TET: not isDirty & external navigation & internal navigation

// TEST: Validators
