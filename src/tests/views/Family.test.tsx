import { screen } from '@testing-library/react'
import { renderRoute } from '../utilsTest/renderRoute'
import { mockEvent } from '@/tests/utilsTest/mocks'
import { formatDate } from '@/utils/formatDate'
import { setupUser } from '../helpers.ts'

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: unknown = await importOriginal()
  return {
    ...(actual as Record<string, unknown>),
    useBlocker: vi.fn(),
  }
})

describe('FamilyForm edit', () => {
  it('displays new event data after edit', async () => {
    // We put the formattedDate here so that the formatting runs in the same locale
    // as the test suite component when it runs formatDate.
    const formattedEventDate = formatDate(mockEvent.date)

    const { user } = renderRoute('/family/mockCCLWFamilyWithOneEvent/edit')

    expect(
      await screen.findByText('Editing: CCLW Family Six'),
    ).toBeInTheDocument()

    expect(
      await screen.findByRole('textbox', { name: 'Title' }),
    ).toBeInTheDocument()

    expect(await screen.findByText('Events')).toBeInTheDocument()
    expect(await screen.findByText('Test event title')).toBeInTheDocument()

    await user.click(screen.getByTestId('edit-event5'))

    expect(
      screen.getByRole('dialog', {
        name: `Edit: Test event title, on ${formattedEventDate}`,
      }),
    ).toBeInTheDocument()

    const eventTitle = screen.getByRole('textbox', { name: 'Event Title' })

    expect(eventTitle).toHaveValue('Test event title')

    await user.clear(eventTitle)

    await user.type(eventTitle, 'New event title')

    await user.click(screen.getByRole('button', { name: 'Update Event' }))

    expect(
      screen.queryByRole('dialog', {
        name: `Edit: Test event title, on ${formattedEventDate}`,
      }),
    ).not.toBeInTheDocument()

    expect(
      await screen.findByText('Event has been successfully updated'),
    ).toBeInTheDocument()
    expect(await screen.findByText('New event title')).toBeInTheDocument()
    expect(screen.queryByText('Test event title')).not.toBeInTheDocument()
  })

  it('displays new document data after edit', async () => {
    const { user } = renderRoute('/family/mockCCLWFamilyOneDocument/edit')

    expect(
      await screen.findByText('Editing: CCLW Family Seven'),
    ).toBeInTheDocument()
    expect(await screen.findByText('Documents')).toBeInTheDocument()
    expect(await screen.findByText('Test document title')).toBeInTheDocument()

    await user.click(screen.getByTestId('edit-document5'))

    expect(
      screen.getByRole('dialog', {
        name: 'Edit: Test document title',
      }),
    ).toBeInTheDocument()

    const documentTitle = screen.getByRole('textbox', { name: 'Title' })

    expect(documentTitle).toHaveValue('Test document title')

    await user.clear(documentTitle)

    await user.type(documentTitle, 'New document title')

    await user.click(screen.getByRole('button', { name: 'Update Document' }))

    expect(
      screen.queryByRole('dialog', {
        name: 'Edit: Test document title',
      }),
    ).not.toBeInTheDocument()

    expect(
      await screen.findByText('Document has been successfully updated'),
    ).toBeInTheDocument()
    expect(await screen.findByText('New document title')).toBeInTheDocument()
    expect(screen.queryByText('Test document title')).not.toBeInTheDocument()
  })
})

describe('FamilyForm create', () => {
  it('allows selection of multiple authors for Reports', async () => {
    setupUser('GCF')
    const { user } = renderRoute('/family/new')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Create new family' }),
    ).toBeInTheDocument()

    await user.type(
      await screen.findByRole('textbox', { name: 'Title' }),
      'Test title',
    )

    await user.click(screen.getByRole('combobox', { name: 'Corpus' }))

    const option = screen.getByRole('option', {
      name: 'Climate Investment Funds Guidance',
    })
    await user.click(option)

    expect(
      screen.getByText('Climate Investment Funds Guidance'),
    ).toBeInTheDocument()

    expect(await screen.findByText('Metadata')).toBeInTheDocument()

    expect(screen.queryByLabelText('Project Id')).not.toBeInTheDocument()
    expect(
      screen.queryByLabelText('Implementing Agency'),
    ).not.toBeInTheDocument()
    expect(
      await screen.findByRole('textbox', { name: 'External Id' }),
    ).toBeInTheDocument()

    const authorInput = await screen.findByRole('textbox', { name: 'Author' })

    await user.type(authorInput, 'Test Author')
    await user.keyboard('[Enter]')
    await user.type(authorInput, 'Test Author')
    await user.keyboard('[Enter]')

    expect(screen.getAllByText('Test Author')).toHaveLength(2)

    expect(await screen.findByLabelText('Author Type')).toBeInTheDocument()
  })
})
