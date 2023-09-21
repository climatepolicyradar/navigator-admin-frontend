import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'

import AuthProvider from './providers/AuthProvider'
import Routes from './routes'

import './styles/main.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
