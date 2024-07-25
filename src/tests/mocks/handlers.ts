import { http } from 'msw'

export const handlers = [
  // Intercept "GET https://example.com/user" requests...
  http.get(
    'https://admin.dev.climatepolicyradar.org/api/v1/events/*',
    () => {},
  ),
]
