import { AxiosError } from 'axios'

import API from '@/api'
import { setToken } from '@/api/Auth'
import { ICollection, ICollectionFormPost, IError } from '@/interfaces'

export async function getCollections(query?: string) {
  setToken(API)

  const response = await API.get<ICollection[]>('/v1/collections/', {
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
        returnPage: '/collections',
      }
      throw e
    })

  return { response }
}

export async function getCollection(id: string) {
  setToken(API)

  const response = await API.get<ICollection>('/v1/collections/' + id)
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

export async function createCollection(data: ICollectionFormPost) {
  setToken(API)

  const response = await API.post<string>('/v1/collections', data)
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

export async function updateCollection(
  data: ICollectionFormPost,
  importId: string,
) {
  setToken(API)

  const response = await API.put<ICollection>(
    '/v1/collections/' + importId,
    data,
  )
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

export async function deleteCollection(id: string) {
  setToken(API)

  const response = await API.delete('/v1/collections/' + id)
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
