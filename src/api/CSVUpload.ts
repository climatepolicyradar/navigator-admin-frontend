import { AxiosError } from 'axios'

import API from '@/api'
import { IError } from '@/interfaces'
import { setToken } from '@/api/Auth'

export interface ICsvUploadResponse {
  message: string
  key: string
}

export async function uploadCsv(file: File) {
  setToken(API)

  const formData = new FormData()
  formData.append('file', file)

  const response = await API.post<ICsvUploadResponse>(
    '/v1/csv-upload',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
    .then((response) => {
      return response.data
    })
    .catch((error: AxiosError<{ detail: unknown }>) => {
      const detail = error.response?.data?.detail
      const e: IError = {
        status: error.response?.status || 500,
        detail: typeof detail === 'string' ? detail : 'Unknown error',
        message: error.message,
      }
      throw e
    })

  return { response }
}
