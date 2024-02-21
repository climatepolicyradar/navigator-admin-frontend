import React from 'react'
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { useConfigMock } from './mocks'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

jest.mock('@/hooks/useConfig', () => ({
  __esModule: true,
  default: useConfigMock,
}))

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <React.StrictMode>
      <ChakraProvider>{children}</ChakraProvider>
    </React.StrictMode>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => rtlRender(ui, { wrapper: AllTheProviders, ...options })

export { customRender }
