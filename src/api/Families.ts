import { AxiosError } from 'axios'

import API from '@/api'
import { IFamily } from '@/interfaces'

export async function getFamilies(query: string | undefined | null) {
  console.log(API.defaults.headers.common['Authorization']);
  const response = await API.get<IFamily[]>('/v1/families/', {
    params: { q: query || 'redd' },
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
  const response = await API.get<IFamily[]>('/v1/families/' + id)
    .then((response) => {
      return response
    })
    .catch((error: AxiosError) => {
      throw new Error(error.message)
    })

  return { response }
}
