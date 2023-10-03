import { AxiosError } from 'axios'

import API from '@/api'
import { ICollection, IError } from '@/interfaces'
import { checkAuth } from '@/utils/checkAuth'

export async function getCollections() {
  checkAuth(API)

  const response = await API.get<ICollection[]>('/v1/collections')
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
