import axios, { AxiosError } from 'axios'

import { ISubdivision, IError } from '@/interfaces'

const geographiesApi = axios.create({
  baseURL: import.meta.env.VITE_GEOGRAPHIES_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function getSubdivisions() {
  const response = await geographiesApi
    .get<ISubdivision[]>('/geographies/subdivisions')
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
