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

  it.skip('displays new document data after edit', async () => {
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

    await waitForElementToBeRemoved(() =>
      screen.queryByRole('dialog', {
        name: 'Edit: Test document title',
      }),
    )

    expect(
      await screen.findByText('Document has been successfully updated'),
    ).toBeInTheDocument()
    expect(await screen.findByText('New document title')).toBeInTheDocument()
    expect(screen.queryByText('Test document title')).not.toBeInTheDocument()
  })
})
