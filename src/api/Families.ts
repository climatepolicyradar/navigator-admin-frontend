import { AxiosError } from 'axios'

import API from '@/api'
import { setToken } from '@/api/Auth'
import { TFamily, IError, TFamilyFormPost } from '@/interfaces'

type TSearchProps = {
  query?: string | null
  geography?: string | null
  status?: string | null
  title?: string | null
  description?: string | null
}

export async function getFamilies({
  query,
  geography,
  status,
  title,
  description,
}: TSearchProps) {
  setToken(API)

  // For API performance reasons (search will timeout if too many results are returned)
  // if there is no search, default to using 'redd'
  const defaultQuery =
    !query && !geography && !status && !title && !description
      ? 'redd'
      : undefined

  const response = await API.get<TFamily[]>('/v1/families/', {
    params: { q: defaultQuery, geography, status, title, description },
  })
    .then((response) => {
      return response
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

export async function getFamily(id: string) {
  setToken(API)

  const response = await API.get<TFamily>('/v1/families/' + id)
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

export async function createFamily(data: TFamilyFormPost) {
  setToken(API)

  const response = await API.post<string>('/v1/families', data)
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

export async function updateFamily(data: TFamilyFormPost, importId: string) {
  setToken(API)

  const response = await API.put<TFamily>('/v1/families/' + importId, data)
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

export async function deleteFamily(id: string) {
  setToken(API)

  const response = await API.delete('/v1/families/' + id)
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
