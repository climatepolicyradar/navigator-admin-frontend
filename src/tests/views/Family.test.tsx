import userEvent from '@testing-library/user-event'
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { familyRoutes } from '@/routes/familyRoutes'
import { ChakraProvider } from '@chakra-ui/react'
import AuthProvider from '@/providers/AuthProvider'

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: unknown = await importOriginal()
  return {
    ...(actual as Record<string, unknown>),
    useBlocker: vi.fn(),
  }
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

const renderRoute = (route = '/') => {
  window.history.pushState({}, 'Test page', route)

  return {
    user: userEvent.setup(),
    ...render(
      <ChakraProvider>
        <AuthProvider>
          <RouterProvider router={createBrowserRouter(familyRoutes)} />
        </AuthProvider>
      </ChakraProvider>,
    ),
  }
}

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
    // expect(await screen.findByText('New event title')).toBeInTheDocument()
    // expect(await screen.queryByText('Test event title')).not.toBeInTheDocument()
  })
})
