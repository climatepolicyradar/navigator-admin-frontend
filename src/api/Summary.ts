import { AxiosError } from 'axios'

import API from '@/api'
import { ISummary, IError } from '@/interfaces'
import { setToken } from '@/api/Auth'

export async function getSummary() {
  setToken(API)

  const response = await API.get<ISummary>('/v1/analytics/summary')
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
