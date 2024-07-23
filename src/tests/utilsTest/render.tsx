import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { vi } from 'vitest'

// Solution for avoid -> Error: Uncaught [TypeError: env.window.matchMedia is not a function]
// Please check https://github.com/chakra-ui/chakra-ui/discussions/6664
// Please check https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
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
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
) => rtlRender(ui, { wrapper: TestWrapper, ...options })

// eslint-disable-next-line react-refresh/only-export-components
export { customRender, TestWrapper }
