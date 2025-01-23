import { AxiosError } from 'axios'

import API from '@/api'
import { setToken } from '@/api/Auth'
import { IError, TFamily, TFamilyFormPost } from '@/interfaces'

export type TFamilySearchQuery = {
  query?: string | null
  geographies?: string[] | null
  status?: string | null
  title?: string | null
  description?: string | null
}

type TSearchParams = {
  q?: string
  geography?: string[]
  status?: string
}

export async function getFamilies({
  query,
  geographies,
  status,
}: TFamilySearchQuery) {
  setToken(API)

  const searchParams: TSearchParams = {
    q: query ?? '',
  }
  if (geographies) {
    searchParams['geography'] = geographies
  }
  if (status) {
    searchParams['status'] = status
  }

  const response = await API.get<TFamily[]>('/v1/families/', {
    params: searchParams,
    paramsSerializer: { indexes: null }, // Allows multiple 'geography' param instances
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
