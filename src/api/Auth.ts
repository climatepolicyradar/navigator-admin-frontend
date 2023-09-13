import { AxiosError } from 'axios'

import API from '@/api'

export const fakeAuth = () =>
  new Promise<string>((resolve) => {
    setTimeout(() => resolve('2342f2f1d131rf12'), 250)
  })

export async function login(username: string, password: string) {
  const response = await API.post('/tokens', null, {
    auth: {
      username,
      password,
    },
  })
    .then((response) => {
      return response
    })
    .catch((error: AxiosError) => {
      throw new Error(error.message)
    })

  return { response }
}
