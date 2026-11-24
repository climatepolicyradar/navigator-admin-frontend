import { IUser } from '@/interfaces/User'
import { http, HttpResponse } from 'msw'

const mockUsers: IUser[] = [
  {
    email: 'test.user@navigator.com',
    name: 'Test User',
    is_superuser: false,
    organisations: [{ id: 1, is_admin: false }],
  },
]

export const userHandlers = [
  http.get('*/v1/users', () => HttpResponse.json(mockUsers)),
  http.get('*/v1/users/:email', ({ params }) => {
    const user = mockUsers.find((u) => u.email === params.email)
    return user
      ? HttpResponse.json(user)
      : HttpResponse.json({ detail: 'User not found' }, { status: 404 })
  }),
  http.post('*/v1/users/:email/password-reset', ({ params }) => {
    const user = mockUsers.find((u) => u.email === params.email)
    return user
      ? HttpResponse.json({ password: 'generated-password-123' })
      : HttpResponse.json({ detail: 'User not found' }, { status: 404 })
  }),
]
