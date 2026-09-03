import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ChakraProvider } from '@chakra-ui/react'
import { CorpusImageUpload } from '@/components/forms/fields/CorpusImageUpload'
import { getUploadUrl } from '@/api/Corpora'
import '../../../setup'

vi.mock('@/api/Corpora', () => ({
  getUploadUrl: vi.fn(),
}))

const originalFetch = global.fetch

describe('CorpusImageUpload', () => {
  const corpusId = 'test-id'
  const onImageChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  const renderComponent = (currentImageUrl: string | null = null) => {
    return render(
      <ChakraProvider>
        <CorpusImageUpload
          corpusId={corpusId}
          currentImageUrl={currentImageUrl}
          onImageChange={onImageChange}
        />
      </ChakraProvider>,
    )
  }

  it('renders a placeholder when there is no current image', () => {
    renderComponent(null)
    expect(screen.getByText(/no image uploaded/i)).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders the current image when one exists', () => {
    renderComponent('https://cdn.example.com/corpora/test-id/logo.png')
    const img = screen.getByRole('img', { name: /corpus logo/i })
    expect(img).toHaveAttribute(
      'src',
      'https://cdn.example.com/corpora/test-id/logo.png',
    )
  })

  it('rejects a non-PNG file before showing the confirm dialog', () => {
    // `userEvent.upload` enforces the input's `accept` attribute the way a
    // real browser file picker would, so a mismatched file never reaches
    // the change handler that way. Firing the change event directly
    // exercises the component's own validation, which exists as
    // defense-in-depth (e.g. against drag-and-drop, which does not respect
    // `accept`).
    renderComponent(null)

    const file = new File(['fake-jpeg-bytes'], 'photo.jpg', {
      type: 'image/jpeg',
    })
    const input = screen.getByLabelText(/upload image/i)
    fireEvent.change(input, { target: { files: [file] } })

    expect(
      screen.getByText(/only png images are supported/i),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /confirm/i }),
    ).not.toBeInTheDocument()
    expect(getUploadUrl).not.toHaveBeenCalled()
  })

  it('rejects a file over 2MB before showing the confirm dialog', async () => {
    renderComponent(null)
    const user = userEvent.setup()

    const bigContent = new Uint8Array(2 * 1024 * 1024 + 1)
    const file = new File([bigContent], 'big.png', { type: 'image/png' })
    const input = screen.getByLabelText(/upload image/i)
    await user.upload(input, file)

    expect(screen.getByText(/2 ?mb/i)).toBeInTheDocument()
    expect(getUploadUrl).not.toHaveBeenCalled()
  })

  it('does not upload when the confirm dialog is cancelled', async () => {
    renderComponent('https://cdn.example.com/corpora/test-id/logo.png')
    const user = userEvent.setup()

    const file = new File(['fake-png-bytes'], 'logo.png', {
      type: 'image/png',
    })
    const input = screen.getByLabelText(/upload image/i)
    await user.upload(input, file)

    const cancelButton = await screen.findByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(getUploadUrl).not.toHaveBeenCalled()
    expect(onImageChange).not.toHaveBeenCalled()
    expect(screen.getByRole('img', { name: /corpus logo/i })).toHaveAttribute(
      'src',
      'https://cdn.example.com/corpora/test-id/logo.png',
    )
  })

  it('uploads the file to the presigned URL and calls onImageChange on confirm', async () => {
    vi.mocked(getUploadUrl).mockResolvedValueOnce({
      response: {
        presigned_upload_url: 'https://s3.example.com/presigned-put',
        object_cdn_url: 'https://cdn.example.com/corpora/test-id/logo.png',
      },
    })
    vi.mocked(global.fetch).mockResolvedValueOnce({ ok: true } as Response)

    renderComponent(null)
    const user = userEvent.setup()

    const file = new File(['fake-png-bytes'], 'logo.png', {
      type: 'image/png',
    })
    const input = screen.getByLabelText(/upload image/i)
    await user.upload(input, file)

    const confirmButton = await screen.findByRole('button', {
      name: /confirm/i,
    })
    await user.click(confirmButton)

    await waitFor(() => {
      expect(getUploadUrl).toHaveBeenCalledWith('test-id')
    })
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://s3.example.com/presigned-put',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-cache' },
          body: file,
        }),
      )
    })
    await waitFor(() => {
      expect(onImageChange).toHaveBeenCalledWith(
        'https://cdn.example.com/corpora/test-id/logo.png',
      )
    })
  })

  it('cache-busts the rendered preview after a fresh upload without changing the saved URL', async () => {
    vi.mocked(getUploadUrl).mockResolvedValueOnce({
      response: {
        presigned_upload_url: 'https://s3.example.com/presigned-put',
        object_cdn_url: 'https://cdn.example.com/corpora/test-id/logo.png',
      },
    })
    vi.mocked(global.fetch).mockResolvedValueOnce({ ok: true } as Response)

    // The S3 key is fixed per corpus, so a fresh upload produces the exact
    // same CDN URL as before. Without cache-busting, the browser (and any
    // CDN edge cache) would keep serving the old cached image for that URL
    // even though the underlying S3 object has changed.
    const { rerender } = renderComponent(
      'https://cdn.example.com/corpora/test-id/logo.png',
    )
    const user = userEvent.setup()

    const file = new File(['fake-png-bytes'], 'logo.png', {
      type: 'image/png',
    })
    const input = screen.getByLabelText(/upload image/i)
    await user.upload(input, file)

    const confirmButton = await screen.findByRole('button', {
      name: /confirm/i,
    })
    await user.click(confirmButton)

    await waitFor(() => {
      expect(onImageChange).toHaveBeenCalledWith(
        'https://cdn.example.com/corpora/test-id/logo.png',
      )
    })

    // Parent re-renders with the (unchanged) saved URL, as CorpusForm does
    // after setValue - the widget must still show the freshly uploaded
    // image, not fall back to the plain cached URL.
    rerender(
      <ChakraProvider>
        <CorpusImageUpload
          corpusId={corpusId}
          currentImageUrl='https://cdn.example.com/corpora/test-id/logo.png'
          onImageChange={onImageChange}
        />
      </ChakraProvider>,
    )

    const img = screen.getByRole('img', { name: /corpus logo/i })
    const src = img.getAttribute('src')
    expect(src).not.toBe('https://cdn.example.com/corpora/test-id/logo.png')
    expect(src).toMatch(
      /^https:\/\/cdn\.example\.com\/corpora\/test-id\/logo\.png\?.+/,
    )
  })

  it('shows an error and does not call onImageChange when the S3 PUT fails', async () => {
    vi.mocked(getUploadUrl).mockResolvedValueOnce({
      response: {
        presigned_upload_url: 'https://s3.example.com/presigned-put',
        object_cdn_url: 'https://cdn.example.com/corpora/test-id/logo.png',
      },
    })
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    renderComponent(null)
    const user = userEvent.setup()

    const file = new File(['fake-png-bytes'], 'logo.png', {
      type: 'image/png',
    })
    const input = screen.getByLabelText(/upload image/i)
    await user.upload(input, file)

    const confirmButton = await screen.findByRole('button', {
      name: /confirm/i,
    })
    await user.click(confirmButton)

    expect(
      await screen.findByText(/failed to upload image/i),
    ).toBeInTheDocument()
    expect(onImageChange).not.toHaveBeenCalled()
  })

  it('shows an error when fetching the presigned URL fails', async () => {
    vi.mocked(getUploadUrl).mockRejectedValueOnce({
      status: 500,
      detail: 'Unknown error',
      message: 'Network error',
    })

    renderComponent(null)
    const user = userEvent.setup()

    const file = new File(['fake-png-bytes'], 'logo.png', {
      type: 'image/png',
    })
    const input = screen.getByLabelText(/upload image/i)
    await user.upload(input, file)

    const confirmButton = await screen.findByRole('button', {
      name: /confirm/i,
    })
    await user.click(confirmButton)

    expect(
      await screen.findByText(/failed to upload image/i),
    ).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
    expect(onImageChange).not.toHaveBeenCalled()
  })
})
