import { AxiosError } from 'axios'

import API from '@/api'
import { IError } from '@/interfaces'
import { setToken } from '@/api/Auth'
import { ICorpusType } from '@/interfaces/CorpusType'

export async function getCorpusTypes() {
  setToken(API)

  const response = await API.get<ICorpusType[]>('/v1/corpus-types')
    .then((response) => {
      return response.data
    })
    .catch((error: AxiosError<{ detail: string }>) => {
      const e: IError = {
        status: error.response?.status || 500,
        detail: error.response?.data?.detail || 'Unknown error',
        message: error.message,
        returnPage: '/corpora',
      }
      throw e
    })

  return { response }
}

export async function getCorpusType(id: string) {
  setToken(API)

  const response = await API.get<ICorpusType>('/v1/corpus-types/' + id)
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
