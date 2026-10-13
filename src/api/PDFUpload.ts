import axios, { AxiosError } from 'axios'

import API from '@/api'
import { IError } from '@/interfaces'
import { setToken } from '@/api/Auth'

export const PDF_CONTENT_TYPE = 'application/pdf'

const UPLOAD_FAILED_MESSAGE =
  'Upload failed. Check your connection and try again.'

export interface IPdfUploadUrl {
  file_name: string
  key: string
  presigned_upload_url: string
  destination_url: string
}

export interface IPdfUploadResult {
  file: File
  key: string
  error?: string
  destination: string
}

export async function getPdfUploadUrls(
  files: File[],
): Promise<IPdfUploadUrl[]> {
  setToken(API)

  return API.post<IPdfUploadUrl[]>('/v1/pdf-upload', {
    files: files.map((file) => ({
      file_name: file.name,
      size: file.size,
      content_type: PDF_CONTENT_TYPE,
    })),
  })
    .then((response) => response.data)
    .catch((error: AxiosError<{ detail: unknown }>) => {
      const detail = error.response?.data?.detail
      const e: IError = {
        status: error.response?.status || 500,
        detail: typeof detail === 'string' ? detail : 'Unknown error',
        message: error.message,
      }
      throw e
    })
}

// Plain axios, not the API instance: the presigned URL points at S3, so the
// app's base URL and auth token is not applicable.
export async function uploadToPresignedUrl(
  file: File,
  presignedUrl: string,
  onProgress?: (fraction: number) => void,
): Promise<void> {
  await axios.put(presignedUrl, file, {
    headers: { 'Content-Type': PDF_CONTENT_TYPE },
    onUploadProgress: (event) => {
      if (event.total) onProgress?.(event.loaded / event.total)
    },
  })
}

export async function uploadPdfs(
  files: File[],
  onProgress?: (fileIndex: number, fraction: number) => void,
): Promise<IPdfUploadResult[]> {
  const urls = await getPdfUploadUrls(files)

  return Promise.all(
    files.map(async (file, index): Promise<IPdfUploadResult> => {
      const { key, presigned_upload_url, destination_url } = urls[index]
      try {
        await uploadToPresignedUrl(file, presigned_upload_url, (fraction) =>
          onProgress?.(index, fraction),
        )
        return { file, key, destination: destination_url }
      } catch {
        return { file, key, error: UPLOAD_FAILED_MESSAGE }
      }
    }),
  )
}
