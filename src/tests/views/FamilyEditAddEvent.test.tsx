import { screen } from '@testing-library/react'
import { renderRoute } from '../utilsTest/renderRoute.tsx'
import { setupUser } from '../helpers.ts'

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: unknown = await importOriginal()
  return {
    ...(actual as Record<string, unknown>),
    useBlocker: vi.fn(),
  }
})

describe('FamilyEditAddEvent', () => {
  it('successfully saves new event data', async () => {
    setupUser({ organisationName: 'UNFCCC', orgId: 3 })
    const { user } = renderRoute(
      '/family/mockUNFCCCFamilyNoDocumentsNoEvents/edit',
    )

    expect(
      await screen.findByText('Editing: UNFCCC Family Three'),
    ).toBeInTheDocument()

    expect(
      await screen.findByRole('textbox', { name: 'Title' }),
    ).toBeInTheDocument()

    expect(await screen.findByText('Events')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add new Event' }))

    expect(
      screen.getByRole('dialog', {
        name: 'Add new Event',
      }),
    ).toBeInTheDocument()

    await user.type(
      screen.getByRole('textbox', { name: 'Event Title' }),
      'Test event title',
    )

    await user.type(
      screen.getByLabelText('Date', { selector: 'input' }),
      '2024-07-11',
    )

    const eventTypeInput = screen.getByRole('combobox', { name: 'Event Type' })
    await user.selectOptions(eventTypeInput, 'Event One')

    await user.click(screen.getByRole('button', { name: 'Create New Event' }))

    expect(
      screen.queryByRole('dialog', {
        name: 'Add new Event',
      }),
    ).not.toBeInTheDocument()

    expect(
      await screen.findByText('Event has been successfully created'),
    ).toBeInTheDocument()

    expect(await screen.findByText('Events')).toBeInTheDocument()
    expect(await screen.findByText('Test event title')).toBeInTheDocument()
  })
})
