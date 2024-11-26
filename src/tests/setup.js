import { cleanup } from '@testing-library/react'
import { reset } from './mocks/repository.ts'
import { server } from './mocks/server.ts'
import * as matchers from '@testing-library/jest-dom/matchers'
import sign from 'jwt-encode'
import { vi } from 'vitest'

expect.extend(matchers)

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = window.ResizeObserver || ResizeObserverMock

// Mock IntersectionObserver
class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver =
  window.IntersectionObserver || IntersectionObserverMock

// Establish API mocking before all tests.
beforeAll(() => {
  server.listen()
  localStorage.setItem('token', sign({ is_superuser: true }, ''))
})

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers()
  cleanup()
  reset()
})

// Clean up after the tests are finished.
afterAll(() => {
  server.close()
  localStorage.clear()
})
