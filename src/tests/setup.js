import { cleanup } from '@testing-library/react'
import { reset } from './mocks/repository.ts'
import { server } from './mocks/server.ts'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

// Establish API mocking before all tests.
beforeAll(() => {
  server.listen()
  localStorage.setItem(
    'token',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc19zdXBlcnVzZXIiOnRydWV9.d72FxLE8LDpEX5_9_pF0NR8k1W1PZe73Nrd2zi2WJJ0',
  )
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
