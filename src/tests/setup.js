import { cleanup } from '@testing-library/react'
import { reset } from './mocks/repository.ts'
import { server } from './mocks/server.ts'
import * as matchers from '@testing-library/jest-dom/matchers'
import { vi } from 'vitest'
import { setupUser } from './helpers.ts'
require('dotenv').config({ path: '.env' })

expect.extend(matchers)

// Mock matchMedia
//
// This is used for testing responsive design features as many UI components from Chakra UI
// depend on this to determine the current viewport size & to apply responsive styles.
//
// The browsers's window.matchMedia is not available in the JSDOM test env.
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
//
// This is used to detect changes in element dimensions that components often use to
// adjust their size e.g., tables, modals.
//
// This helps to prevent errors during tests.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = window.ResizeObserver || ResizeObserverMock

// Mock IntersectionObserver.
//
// This is used for detecting when an element is in the viewport. This is particularly
// useful for features such as infinite scrolling, lazy loading or visibility based
// animations.
//
// This helps to prevent errors since this API is not available in the JSDOM test env.
class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver =
  window.IntersectionObserver || IntersectionObserverMock

// Establish API mocking before all tests.
beforeAll(() => {
  if (!process.env.DISABLE_MSW) {
    server.listen()
  }
  setupUser()
})

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  if (!process.env.DISABLE_MSW) {
    server.resetHandlers()
  }
  cleanup()
  reset()
})

// Clean up after the tests are finished.
afterAll(() => {
  if (!process.env.DISABLE_MSW) {
    server.close()
  }
  localStorage.clear()
})
