import { AxiosError } from 'axios'

import API from '@/api'
import { setToken } from '@/api/Auth'
import { IError } from '@/interfaces'
import { IUser } from '@/interfaces/User'

export async function getUsers() {
  setToken(API)

  const response = await API.get<IUser[]>('/v1/users')
    .then((response) => {
      return response.data
    })
    .catch((error: AxiosError<{ detail: string }>) => {
      const e: IError = {
        status: error.response?.status || 500,
        detail: error.response?.data?.detail || 'Unknown error',
        message: error.message,
      }
      throw e
    })

  return { response }
}

export async function getUser(email: string) {
  setToken(API)

  const response = await API.get<IUser>(
    '/v1/users/' + encodeURIComponent(email),
  )
    .then((response) => {
      return response
    })
    .catch((error: AxiosError<{ detail: string }>) => {
      const e: IError = {
        status: error.response?.status || 500,
        detail: error.response?.data?.detail || 'Unknown error',
        message: error.message,
      }
      throw e
    })

  return { response }
}
