import AuthProvider from '@/providers/AuthProvider'
import { familyRoutes } from '@/routes/familyRoutes'
import { ChakraProvider } from '@chakra-ui/react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

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

export const renderRoute = (route = '/') => {
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
