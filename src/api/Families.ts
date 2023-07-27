import { AxiosError } from 'axios'

import API from '@/api'
import { TFamily } from '@/interfaces'

export async function getFamilies(query: string) {
  const response = await API.get<TFamily[]>('/families/', {
    params: { q: 'redd' },
  })
    .then((response) => {
      return response
    })
    .catch((error: AxiosError) => {
      throw new Error(error.message)
    })

  return { response }
}

export async function getFamily(id: string) {
  const response = await API.get<TFamily[]>('/families/' + id)
    .then((response) => {
      return response
    })
    .catch((error: AxiosError) => {
      throw new Error(error.message)
    })

  return { response }
}
