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

const renderComponent = (mockFamily: TFamily | undefined) =>
  render(
    <TestWrapper>
      <FamilyForm family={mockFamily} />
    </TestWrapper>,
  )

describe('FamilyForm', () => {
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
        'You do not have permission to edit document families in CCLW national policies',
      ),
    ).toBeInTheDocument()
  })

  it('renders FamilyReadDTO data on edit', async () => {
    const testFamily = mockFamiliesData[1]
    localStorage.setItem('token', 'token')
    const { getByTestId } = renderComponent(testFamily)
    await flushPromises()

    expect(getByTestId('input-id')).toHaveValue(testFamily.import_id)
    expect(getByTestId('corpus-id')).toHaveValue(testFamily.corpus_import_id)
    expect(getByTestId('corpus-title')).toHaveValue(testFamily.corpus_title)
    expect(getByTestId('corpus-type')).toHaveValue(testFamily.corpus_type)

    expect(screen.queryByText('corpus')).toBeNull() // it doesn't exist
  })
})

describe('FamilyForm Icons Visibility', () => {
  it('displays warning icon next to "Add new document" button when there are no documents', async () => {
    const familyWithoutDocuments = { ...mockFamiliesData[0], documents: [] }
    localStorage.setItem('token', 'token')
    const { getByTestId } = renderComponent(familyWithoutDocuments)
    await flushPromises()

    const warningIconDocument = getByTestId('warning-icon-document')
    expect(warningIconDocument).toBeInTheDocument()
  })

  it('displays warning icon next to "Add new event" button when there are no events', async () => {
    const familyWithoutEvents = { ...mockFamiliesData[0], events: [] }
    localStorage.setItem('token', 'token')
    const { getByTestId } = renderComponent(familyWithoutEvents)
    await flushPromises()

    const warningIconEvent = getByTestId('warning-icon-event')
    expect(warningIconEvent).toBeInTheDocument()
  })

  it('does not display warning icon next to "Add new document/events" button when there are documents/events', async () => {
    const family = mockFamiliesData[0]
    localStorage.setItem('token', 'token')
    renderComponent(family)
    await flushPromises()

    const warningIconEvent = screen.queryByTestId('warning-icon-event')
    const warningIconDocument = screen.queryByTestId('warning-icon-document')
    expect(warningIconEvent).not.toBeInTheDocument()
    expect(warningIconDocument).not.toBeInTheDocument()
  })
})

// TEST: isDirty & external navigation & internal navigation

// TET: not isDirty & external navigation & internal navigation

// TEST: Validators
