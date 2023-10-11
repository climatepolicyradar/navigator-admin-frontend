import { AxiosError } from 'axios'

import API from '@/api'
import { ICollection, ICollectionFormPost, IError } from '@/interfaces'
import { setToken } from '@/api/Auth'

export async function getCollections() {
  setToken(API)

  const response = await API.get<ICollection[]>('/v1/collections')
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

export async function createCollection(data: ICollectionFormPost) {
  setToken(API)

  const response = await API.post<ICollection>('/v1/collection', data)
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

export async function updateCollection(data: ICollectionFormPost) {
  setToken(API)

  const response = await API.put<ICollection>('/v1/collections', data)
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
