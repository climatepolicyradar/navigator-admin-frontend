import { AxiosError } from 'axios'

import API from '@/api'
import { TFamily } from '@/types'

export async function getFamilies(query: string) {
  const families = await API.get<TFamily[]>('/families/', {
    params: { q: query },
  })
    .then((response) => {
      return response
    })
    .catch((error: AxiosError) => {
      throw new Error(error.message);
    })

  return { families }
}
