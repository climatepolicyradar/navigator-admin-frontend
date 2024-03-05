import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { useConfigMock } from './mocks'

// Solution for avoid -> Error: Uncaught [TypeError: env.window.matchMedia is not a function]
// Please check https://github.com/chakra-ui/chakra-ui/discussions/6664
// Please check https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
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

// eslint-disable-next-line react-refresh/only-export-components
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <React.StrictMode>
      <ChakraProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </ChakraProvider>
    </React.StrictMode>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => rtlRender(ui, { wrapper: AllTheProviders, ...options })

export { customRender }
