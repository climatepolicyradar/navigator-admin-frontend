import { AxiosError } from 'axios'

import API from '@/api'
import { IError } from '@/interfaces'

type TLogin = {
  username: string
  password: string
}

type TLoginResponse = {
  access_token: string
  token_type: string
}

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
      return response.data.access_token
    })
    .catch((error: AxiosError<{ detail: string }>) => {
      const e: IError = {
        status: error.response?.status || 500,
        detail: error.response?.data?.detail || 'Unknown error',
        message: error.message,
        returnPage: '/families',
      }
      throw e
    })

  return { response }
}