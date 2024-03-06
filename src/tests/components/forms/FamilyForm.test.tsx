import { configure, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render, cleanup } from '@testing-library/react'
import {
  configMock,
  mockDocument,
  mockFamiliesData,
} from '@/tests/utilsTest/mocks'
import { FamilyForm } from '@/components/forms/FamilyForm'
import { TFamily } from '@/interfaces'
import 'jest-localstorage-mock'
import { TestWrapper } from '@/tests/utilsTest/render'

const flushPromises = async () =>
  new Promise((resolve) => process.nextTick(resolve))

// useBlocker only can be used in a router context
jest.mock('react-router-dom', (): unknown => ({
  ...jest.requireActual('react-router-dom'),
  useBlocker: jest.fn(),
}))

// API calls
jest.mock('@/api', () => ({
  getApiUrl: jest.fn().mockReturnValue('http://mock-api-url'),
}))

const localStorageMock = {
  getItem: () => 'token',
  setItem: jest.fn(),
  clear: jest.fn(),
  length: 1,
  key: jest.fn(),
  removeItem: jest.fn(),
}

global.localStorage = localStorageMock

jest.mock('@/hooks/useConfig', () =>
  jest.fn().mockReturnValue({
    config: configMock,
    error: null,
    loading: false,
  }),
)

jest.mock('@/hooks/useCollections', () =>
  jest.fn().mockReturnValue({
    collections: [],
    error: null,
    loading: false,
    reload: jest.fn(),
  }),
)

jest.mock('@/hooks/useDocument', () =>
  jest.fn().mockReturnValue({
    document: mockDocument,
    error: null,
    loading: false,
  }),
)

jest.mock('@/hooks/useEvent', () =>
  jest.fn().mockReturnValue({
    event: {},
    error: null,
    loading: false,
  }),
)

jest.mock('@/utils/decodeToken', () => ({
  decodeToken: () => ({
    sub: 'sub',
    email: 'user@here.com',
    is_superuser: false,
    authorisation: { CCLW: { is_admin: true } },
    exp: 234,
  }),
}))

const renderComponent = (mockFamily: TFamily) =>
  render(
    <TestWrapper>
      <FamilyForm family={mockFamily} />
    </TestWrapper>,
  )

describe('FamilyList', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-test-id' }))

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(cleanup)

  it('warns when no access', async () => {
    const testFamily = mockFamiliesData[1]
    renderComponent(testFamily)
    await flushPromises()

    expect(
      screen.getByText(
        'You do not have permission to edit CCLW document families',
      ),
    ).toBeInTheDocument()
  })

  it('renders family data', async () => {
    const testFamily = mockFamiliesData[1]
    localStorage.setItem('token', 'token')
    const { getByTestId } = renderComponent(testFamily)
    await flushPromises()

    const input = getByTestId('input-id')
    expect(input).toHaveValue(testFamily.import_id)
  })
})

// TEST: isDirty & external navigation & internal navigation

// TET: not isDirty & external navigation & internal navigation

// TEST: Validators
