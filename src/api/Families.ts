import { AxiosError } from 'axios'

import API from '@/api'
import { IFamily, IError } from '@/interfaces'

const checkAuth = () => {
  if (!API.defaults.headers.common['Authorization']) {
    API.defaults.headers.common['Authorization'] =
      'Bearer ' + (localStorage.getItem('token') ?? '')
  }
}

export async function getFamilies(query: string | undefined | null) {
  checkAuth()

  const response = await API.get<IFamily[]>('/v1/families/', {
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
  checkAuth()

  const response = await API.get<IFamily[]>('/v1/families/' + id)
    .then((response) => {
      return response
    })
    .catch((error: AxiosError) => {
      throw new Error(error.message)
    })

  return { response }
}
