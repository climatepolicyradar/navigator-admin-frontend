import { cleanup } from '@testing-library/react'
import { reset } from './mocks/repository.ts'
import { server } from './mocks/server.ts'
import * as matchers from '@testing-library/jest-dom/matchers'
import sign from 'jwt-encode'

expect.extend(matchers)

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
