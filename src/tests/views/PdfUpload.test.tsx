import { fireEvent, render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import '../setup'

import '@testing-library/jest-dom'
import PDFUpload from '@/views/pdfUpload/pdfUpload'
import { uploadPdfs } from '@/api/PDFUpload'
import { validatePdfFiles } from '@/utils/validatePDFDocument'

vi.mock('@/api/PDFUpload', () => ({
  uploadPdfs: vi.fn(),
}))

vi.mock('@/utils/validatePDFDocument', () => ({
  MAX_PDF_FILES_PER_REQUEST: 10,
  validatePdfFiles: vi.fn(),
}))

const mockUpload = vi.mocked(uploadPdfs)
const mockValidate = vi.mocked(validatePdfFiles)

const UPLOAD_FAILED_MESSAGE =
  'Upload failed. Check your connection and try again.'

const pdf = (name: string) =>
  new File(['%PDF-1.7'], name, { type: 'application/pdf' })

const renderComponent = () =>
  render(
    <ChakraProvider>
      <PDFUpload />
    </ChakraProvider>,
  )

const selectFiles = (files: File[]) =>
  fireEvent.change(screen.getByLabelText(/browse files/i), {
    target: { files },
  })

describe('PDFUpload', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockValidate.mockResolvedValue(null)
  })

  it('lists the selected PDFs', async () => {
    renderComponent()

    selectFiles([pdf('a.pdf'), pdf('b.pdf')])

    expect(await screen.findByText('a.pdf')).toBeInTheDocument()
    expect(screen.getByText('b.pdf')).toBeInTheDocument()
    expect(screen.getByText('2 files selected')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Upload 2 PDFs' })).toBeEnabled()
  })

  it('shows an error and does not list a file that fails validation', async () => {
    mockValidate.mockResolvedValueOnce('notes.txt is not a PDF.')
    renderComponent()

    selectFiles([pdf('notes.txt')])

    expect(
      await screen.findByText('notes.txt is not a PDF.'),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('list', { name: 'Selected PDF files' }),
    ).not.toBeInTheDocument()
  })

  it('rejects a file that is already selected', async () => {
    renderComponent()

    selectFiles([pdf('a.pdf')])
    await screen.findByText('1 file selected')
    selectFiles([pdf('a.pdf')])

    expect(
      await screen.findByText('a.pdf is already selected.'),
    ).toBeInTheDocument()
    expect(screen.getByText('1 file selected')).toBeInTheDocument()
  })

  it('warns and disables upload when more than 10 files are selected', async () => {
    renderComponent()

    selectFiles(Array.from({ length: 11 }, (_, i) => pdf(`file_${i}.pdf`)))

    expect(
      await screen.findByText(/remove 1 file to continue/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Upload 11 PDFs' }),
    ).toBeDisabled()
  })

  it('uploads the files and shows the stored keys on success', async () => {
    const file = pdf('a.pdf')
    mockUpload.mockResolvedValueOnce([
      {
        file,
        key: '2026-10-12/a.pdf',
        destination: 'www.amazon.com/2026-10-12/a.pdf',
      },
    ])
    renderComponent()

    selectFiles([file])
    fireEvent.click(await screen.findByRole('button', { name: 'Upload 1 PDF' }))

    expect(await screen.findByText('Upload successful')).toBeInTheDocument()
    expect(
      screen.getByText('www.amazon.com/2026-10-12/a.pdf'),
    ).toBeInTheDocument()
    expect(mockUpload).toHaveBeenCalledWith([file], expect.any(Function))
  })

  it('marks the failed file and retries only that file', async () => {
    const a = pdf('a.pdf')
    const b = pdf('b.pdf')
    mockUpload.mockResolvedValueOnce([
      {
        file: a,
        key: '2026-10-12/a.pdf',
        destination: 'www.amazon.com/2026-10-12/a.pdf',
      },
      {
        file: b,
        key: '2026-10-12/b.pdf',
        destination: 'www.amazon.com/2026-10-12/b.pdf',
        error: UPLOAD_FAILED_MESSAGE,
      },
    ])
    renderComponent()

    selectFiles([a, b])
    fireEvent.click(
      await screen.findByRole('button', { name: 'Upload 2 PDFs' }),
    )

    expect(await screen.findByText('Failed')).toBeInTheDocument()
    expect(screen.getByText(UPLOAD_FAILED_MESSAGE)).toBeInTheDocument()

    mockUpload.mockResolvedValueOnce([
      {
        file: b,
        key: '2026-10-12/b.pdf',
        destination: 'www.amazon.com/2026-10-12/b.pdf',
      },
    ])
    fireEvent.click(
      screen.getByRole('button', { name: 'Retry failed uploads' }),
    )

    expect(await screen.findByText('Upload successful')).toBeInTheDocument()
    expect(mockUpload).toHaveBeenLastCalledWith([b], expect.any(Function))
  })

  it('shows the error when the request fails', async () => {
    mockUpload.mockRejectedValueOnce({
      status: 422,
      detail: 'Invalid request',
      message: 'Request failed with status code 422',
    })
    renderComponent()

    selectFiles([pdf('a.pdf')])
    fireEvent.click(await screen.findByRole('button', { name: 'Upload 1 PDF' }))

    expect(await screen.findByText('Invalid request')).toBeInTheDocument()
    expect(screen.getByText('Ready')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Upload 1 PDF' })).toBeEnabled()
  })

  it('removes a single file and clears all files', async () => {
    renderComponent()

    selectFiles([pdf('a.pdf'), pdf('b.pdf')])
    fireEvent.click(await screen.findByRole('button', { name: 'Remove a.pdf' }))

    expect(screen.queryByText('a.pdf')).not.toBeInTheDocument()
    expect(screen.getByText('1 file selected')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }))

    expect(
      screen.queryByRole('list', { name: 'Selected PDF files' }),
    ).not.toBeInTheDocument()
  })
})
