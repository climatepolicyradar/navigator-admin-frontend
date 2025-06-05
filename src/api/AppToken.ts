import { AxiosError } from 'axios'

import API from '@/api'
import { setToken } from '@/api/Auth'
import { IError } from '@/interfaces'
import { IAppTokenFormPost } from '@/interfaces/AppToken'

export async function createAppToken(data: IAppTokenFormPost) {
  setToken(API)

  const response = await API.post<string>('/v1/app-tokens', data)
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
