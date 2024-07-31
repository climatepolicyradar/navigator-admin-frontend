import { configure, screen, render, cleanup } from '@testing-library/react'
import {
  configMock,
  mockDocument,
  mockFamiliesData,
} from '@/tests/utilsTest/mocks'
import { FamilyForm } from '@/components/forms/FamilyForm'
import { TFamily } from '@/interfaces'
import { TestWrapper } from '@/tests/utilsTest/render'
import '@testing-library/jest-dom'

const flushPromises = async () =>
  new Promise((resolve) => process.nextTick(resolve))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: unknown = await importOriginal()
  return {
    ...(actual as Record<string, unknown>),
    useBlocker: vi.fn(),
  }
})

vi.mock('@/hooks/useConfig', () => ({
  default: vi.fn().mockReturnValue({
    config: configMock,
    error: null,
    loading: false,
  }),
}))

vi.mock('@/hooks/useCollections', () => ({
  default: vi.fn().mockReturnValue({
    collections: [],
    error: null,
    loading: false,
    reload: vi.fn(),
  }),
}))

vi.mock('@/hooks/useDocument', () => ({
  default: vi.fn().mockReturnValue({
    document: mockDocument,
    error: null,
    loading: false,
  }),
}))

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

vi.mock('@/utils/decodeToken', () => ({
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

  afterEach(cleanup)

  it('warns when no access', async () => {
    localStorage.clear()
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
    const { getByTestId, getAllByText } = renderComponent(testFamily)
    await flushPromises()
    const expectedEvents = getAllByText('Test event title')

    expect(getByTestId('input-id')).toHaveValue(testFamily.import_id)
    expect(getByTestId('corpus-id')).toHaveValue(testFamily.corpus_import_id)
    expect(getByTestId('corpus-title')).toHaveValue(testFamily.corpus_title)
    expect(getByTestId('corpus-type')).toHaveValue(testFamily.corpus_type)

    expect(expectedEvents).toHaveLength(2)
    expect(expectedEvents[0]).toHaveTextContent('Test event title')

    expect(screen.queryByText('corpus')).toBeNull() // it doesn't exist
  })
})

describe('FamilyForm Icons Visibility', () => {
  it('displays warning icon next to "Add new document" button when there are no documents', async () => {
    const familyWithoutDocuments = { ...mockFamiliesData[0], documents: [] }
    const { getByTestId } = renderComponent(familyWithoutDocuments)
    await flushPromises()

    const warningIconDocument = getByTestId('warning-icon-document')
    expect(warningIconDocument).toBeInTheDocument()
  })

  it('displays warning icon next to "Add new event" button when there are no events', async () => {
    const familyWithoutEvents = { ...mockFamiliesData[0], events: [] }
    const { getByTestId } = renderComponent(familyWithoutEvents)
    await flushPromises()

    const warningIconEvent = getByTestId('warning-icon-event')
    expect(warningIconEvent).toBeInTheDocument()
  })

  it('does not display warning icon next to "Add new document/events" button when there are documents/events', async () => {
    const family = mockFamiliesData[0]
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
