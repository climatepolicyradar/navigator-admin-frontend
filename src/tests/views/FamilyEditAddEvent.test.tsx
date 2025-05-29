import { screen, within } from '@testing-library/react'
import { renderRoute } from '../utilsTest/renderRoute.tsx'
import { mockEvent } from '@/tests/utilsTest/mocks'
import { formatDate } from '@/utils/formatDate'
import { setupUser } from '../helpers.ts'
import fs from 'fs'
import { prettyDOM } from '@testing-library/react'
import { title } from 'process'

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: unknown = await importOriginal()
  return {
    ...(actual as Record<string, unknown>),
    useBlocker: vi.fn(),
  }
})

describe('FamilyEditAddEvent', () => {
  it('successfully saves new event data', async () => {
    // We put the formattedDate here so that the formatting runs in the same locale
    // as the test suite component when it runs formatDate.

    const formattedEventDate = formatDate(mockEvent.date)

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

    const titleInput = screen.getByRole('textbox', { name: 'Event Title' })
    await user.type(titleInput, 'Test event title')

    const dateInput = screen.getByLabelText('Date', { selector: 'input' })
    // await user.type(dateInput, formattedEventDate)
    await user.type(dateInput, '2024-07-11')

    // console.log(dateInput)

    const eventTypeInput = screen.getByRole('combobox', { name: 'Event Type' })

    await user.click(eventTypeInput)
    const eventOption = await screen.findByRole('option', { name: 'Event One' })
    await user.click(eventOption)
    await user.selectOptions(eventTypeInput, 'Event One')
    const selectedOption = within(eventTypeInput).getByRole('option', {
      selected: true,
    })
    console.log(selectedOption)
    // console.log(eventTypeInput)

    await user.click(screen.getByRole('button', { name: 'Create New Event' }))

    const domOutput = prettyDOM(document.body, 300000, { highlight: false })
    fs.writeFileSync('debug-output.html', domOutput)

    expect(
      screen.queryByRole('button', { name: 'Create New Event' }),
    ).not.toBeInTheDocument()

    expect(
      await screen.findByText('Event has been successfully created'),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('dialog', {
        name: 'Add new Event',
      }),
    ).not.toBeInTheDocument()

    expect(await screen.findByText('Events')).toBeInTheDocument()
    expect(await screen.findByText('Test event title')).toBeInTheDocument()
  })
})
