import { AxiosError } from 'axios'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import API from '@/api'
import { getUploadUrl } from '@/api/Corpora'

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

// eslint-disable-next-line @typescript-eslint/unbound-method -- vi.mocked() on an axios instance method is a standard vitest mocking pattern, not an unbound `this` access
const mockPost = vi.mocked(API.post)

describe('getUploadUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the presigned upload URL and CDN URL on success', async () => {
    const mockData = {
      presigned_upload_url: 'https://s3.example.com/presigned',
      object_cdn_url: 'https://cdn.example.com/corpora/test-id/logo.png',
    }
    mockPost.mockResolvedValueOnce({ data: mockData })

    const result = await getUploadUrl('test-id')

    expect(mockPost).toHaveBeenCalledWith('/v1/corpora/test-id/upload-url')
    expect(result).toEqual({ response: mockData })
  })

  it('throws a wrapped IError when the request fails', async () => {
    const axiosError = {
      isAxiosError: true,
      response: { status: 403, data: { detail: 'Forbidden' } },
      message: 'Request failed with status code 403',
    } as AxiosError<{ detail: string }>
    mockPost.mockRejectedValueOnce(axiosError)

    await expect(getUploadUrl('test-id')).rejects.toEqual({
      status: 403,
      detail: 'Forbidden',
      message: 'Request failed with status code 403',
    })
  })
})
