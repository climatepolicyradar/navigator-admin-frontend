import { AxiosError } from 'axios'

import API from '@/api'
import { IConfig, IError } from '@/interfaces'
import { setToken } from '@/api/Auth'

export async function getConfig() {
  setToken(API)

  const response = await API.get<IConfig>('/v1/config')
    .then((response) => {
      return response.data
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
