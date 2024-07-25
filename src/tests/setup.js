import { cleanup } from '@testing-library/react'
import { server } from './mocks/server.ts'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

// Establish API mocking before all tests.
beforeAll(() => server.listen())

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers()
  cleanup()
})

// Clean up after the tests are finished.
afterAll(() => server.close())
