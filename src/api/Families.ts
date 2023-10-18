import { AxiosError } from 'axios'

import API from '@/api'
import { setToken } from '@/api/Auth'
import { TFamily, IError, TFamilyFormPost } from '@/interfaces'

export async function getFamilies(query: string | undefined | null) {
  setToken(API)

  const response = await API.get<TFamily[]>('/v1/families/', {
    params: { q: query || 'redd' },
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

  const response = await API.post<TFamily>('/v1/families', data)
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

export async function updateFamily(data: TFamilyFormPost) {
  setToken(API)

  const response = await API.put<TFamily>('/v1/families', data)
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
