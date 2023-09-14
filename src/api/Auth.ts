import { AxiosError } from 'axios'

import API from '@/api'

type TLogin = {
  username: string
  password: string
}

type TLoginResponse = {
  access_token: string
  token_type: string
}

export const fakeAuth = () =>
  new Promise<string>((resolve) => {
    setTimeout(() => resolve('2342f2f1d131rf12'), 250)
  })

export async function login({ username, password }: TLogin) {
  const response = await API.post<TLoginResponse>(
    '/tokens',
    {
      username,
      password,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )
    .then((response) => {
      console.log(response)
      return response.data.access_token
    })
    .catch((error: AxiosError) => {
      throw new Error(error.message)
    })

  return { response }
}
