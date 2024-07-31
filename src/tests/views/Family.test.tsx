import { screen, waitForElementToBeRemoved } from '@testing-library/react'
import { renderRoute } from '../utilsTest/renderRoute'

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: unknown = await importOriginal()
  return {
    ...(actual as Record<string, unknown>),
    useBlocker: vi.fn(),
  }
})

describe('FamilyForm edit', () => {
  it('displays new event data after edit', async () => {
    const { user } = renderRoute('/family/mockCCLWFamilyWithOneEvent/edit')

    expect(
      await screen.findByText('Editing: CCLW Family Six'),
    ).toBeInTheDocument()
    expect(await screen.findByText('Events')).toBeInTheDocument()
    expect(await screen.findByText('Test event title')).toBeInTheDocument()

    await user.click(screen.getByTestId('edit-event5'))

    expect(
      screen.getByRole('dialog', {
        name: 'Edit: Test event title, on 11/7/2024',
      }),
    ).toBeInTheDocument()

    const eventTitle = screen.getByRole('textbox', { name: 'Title' })

    expect(eventTitle).toHaveValue('Test event title')

    await user.clear(eventTitle)

    await user.type(eventTitle, 'New event title')

    await user.click(screen.getByRole('button', { name: 'Update Event' }))

    await waitForElementToBeRemoved(() =>
      screen.queryByRole('dialog', {
        name: 'Edit: Test event title, on 11/7/2024',
      }),
    )

    expect(
      await screen.findByText('Event has been successfully updated'),
    ).toBeInTheDocument()
    expect(await screen.findByText('New event title')).toBeInTheDocument()
    expect(screen.queryByText('Test event title')).not.toBeInTheDocument()
  })
})
