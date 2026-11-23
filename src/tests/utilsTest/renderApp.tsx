import { ChakraProvider } from '@chakra-ui/react'
import { render } from '@testing-library/react'
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
