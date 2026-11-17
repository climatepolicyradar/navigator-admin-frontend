import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import AuthProvider from '@/providers/AuthProvider'
import Routes from '@/routes'

export const renderApp = (path: string) => {
  window.history.pushState({}, '', path)

  return render(
    <ChakraProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ChakraProvider>,
  )
}

export const expectRedirectedToDashboard = async () => {
  expect(
    await screen.findByRole('heading', { level: 1, name: 'Dashboard' }),
  ).toBeInTheDocument()
  expect(window.location.pathname).toBe('/')
}
