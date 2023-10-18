import { AxiosError } from 'axios'

import API from '@/api'
import { setToken } from '@/api/Auth'
import { IDocument, IError } from '@/interfaces'

export async function getDocuments(query: string | undefined | null) {
  setToken(API)

  const response = await API.get<IDocument[]>('/v1/documents/', {
    params: { q: query || 'carbon' },
  })
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

export async function getDocument(id: string) {
  setToken(API)

  const response = await API.get<IDocument>('/v1/documents/' + id)
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

export async function deleteDocument(id: string) {
  setToken(API)

  const response = await API.delete('/v1/documents/' + id)
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
