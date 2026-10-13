import axios from 'axios'
import type { AxiosError } from 'axios'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import API from '@/api'
import { getPdfUploadUrls, uploadPdfs } from '@/api/PDFUpload'

vi.mock('@/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}))

vi.mock('@/api/Auth', () => ({
  setToken: vi.fn(),
}))

// The S3 upload uses plain axios, not the authenticated API instance
vi.mock('axios', () => ({
  default: {
    put: vi.fn(),
  },
}))

/* eslint-disable @typescript-eslint/unbound-method -- vi.mocked() on an axios method is a standard vitest mocking pattern, not an unbound `this` access */
const mockPost = vi.mocked(API.post)
const mockS3Put = vi.mocked(axios.put)
/* eslint-enable @typescript-eslint/unbound-method */

const UPLOAD_FAILED_MESSAGE =
  'Upload failed. Check your connection and try again.'

const pdf = (name: string) =>
  new File(['%PDF-1.7'], name, { type: 'application/pdf' })

const axiosError = (status?: number, detail?: unknown) =>
  ({
    isAxiosError: true,
    response: status ? { status, data: { detail } } : undefined,
    message: status
      ? `Request failed with status code ${status}`
      : 'Network Error',
  }) as unknown as AxiosError<{ detail: unknown }>

describe('getPdfUploadUrls', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sends the file metadata and returns the upload URLs', async () => {
    const file = pdf('report.pdf')
    const urls = [
      {
        file_name: 'report.pdf',
        key: '2026-10-12/report.pdf',
        presigned_upload_url: 'https://s3.example.com/presigned',
      },
    ]
    mockPost.mockResolvedValueOnce({ data: urls })

    const result = await getPdfUploadUrls([file])

    expect(mockPost).toHaveBeenCalledWith('/v1/pdf-upload', {
      files: [
        {
          file_name: 'report.pdf',
          size: file.size,
          content_type: 'application/pdf',
        },
      ],
    })
    expect(result).toEqual(urls)
  })

  it('throws a wrapped IError with a string detail', async () => {
    mockPost.mockRejectedValueOnce(axiosError(500, 'Upload not configured'))

    await expect(getPdfUploadUrls([pdf('report.pdf')])).rejects.toEqual({
      status: 500,
      detail: 'Upload not configured',
      message: 'Request failed with status code 500',
    })
  })

  it('falls back to status 500 and an unknown error when there is no response', async () => {
    mockPost.mockRejectedValueOnce(axiosError())

    await expect(getPdfUploadUrls([pdf('report.pdf')])).rejects.toEqual({
      status: 500,
      detail: 'Unknown error',
      message: 'Network Error',
    })
  })
})

describe('uploadPdfs', () => {
  const fileA = pdf('a.pdf')
  const fileB = pdf('b.pdf')
  const urls = [
    {
      file_name: 'a.pdf',
      key: '2026-10-12/a.pdf',
      presigned_upload_url: 'https://s3.example.com/a',
    },
    {
      file_name: 'b.pdf',
      key: '2026-10-12/b.pdf',
      presigned_upload_url: 'https://s3.example.com/b',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uploads each file to its own URL and returns results in request order', async () => {
    mockPost.mockResolvedValueOnce({ data: urls })
    mockS3Put.mockResolvedValue({})

    const results = await uploadPdfs([fileA, fileB])

    expect(mockS3Put).toHaveBeenCalledWith(
      'https://s3.example.com/a',
      fileA,
      expect.anything(),
    )
    expect(mockS3Put).toHaveBeenCalledWith(
      'https://s3.example.com/b',
      fileB,
      expect.anything(),
    )
    expect(results).toEqual([
      { file: fileA, key: '2026-10-12/a.pdf' },
      { file: fileB, key: '2026-10-12/b.pdf' },
    ])
  })

  it('marks only the failed file as failed when one upload fails', async () => {
    mockPost.mockResolvedValueOnce({ data: urls })
    mockS3Put.mockResolvedValueOnce({}).mockRejectedValueOnce(new Error('boom'))

    const results = await uploadPdfs([fileA, fileB])

    expect(results).toEqual([
      { file: fileA, key: '2026-10-12/a.pdf' },
      { file: fileB, key: '2026-10-12/b.pdf', error: UPLOAD_FAILED_MESSAGE },
    ])
  })

  it('throws and uploads nothing when the upload URLs cannot be fetched', async () => {
    mockPost.mockRejectedValueOnce(axiosError(422, 'Invalid request'))

    await expect(uploadPdfs([fileA, fileB])).rejects.toEqual({
      status: 422,
      detail: 'Invalid request',
      message: 'Request failed with status code 422',
    })
    expect(mockS3Put).not.toHaveBeenCalled()
  })
})
