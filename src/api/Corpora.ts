import { AxiosError } from 'axios'

import API from '@/api'
import { ICorpus, ICorpusFormPost, ICorpusFormPut, IError } from '@/interfaces'
import { setToken } from '@/api/Auth'

export async function getCorpora(query?: string) {
  setToken(API)

  const response = await API.get<ICorpus[]>('/v1/corpora/', {
    params: { q: query || '', max_results: 999999 },
  })
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

export async function getCorpus(id: string) {
  setToken(API)

  const response = await API.get<ICorpus>('/v1/corpora/' + id)
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

export async function createCorpus(data: ICorpusFormPost) {
  setToken(API)

  const response = await API.post<string>('/v1/corpora', data)
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

export async function updateCorpus(data: ICorpusFormPut, importId: string) {
  setToken(API)

  const response = await API.put<ICorpus>('/v1/corpora/' + importId, data)
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
