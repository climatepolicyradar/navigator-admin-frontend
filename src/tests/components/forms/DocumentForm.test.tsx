import '@testing-library/jest-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { DocumentForm } from '@/components/forms/DocumentForm'
import { IDocument } from '@/interfaces'
import { ChakraProvider } from '@chakra-ui/react'

import React from 'react'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

jest.mock('@/api/Documents', () => ({
  createDocument: jest
    .fn()
    .mockResolvedValue({ response: { documentId: 'some-id' } }),
  updateDocument: jest
    .fn()
    .mockResolvedValue({ response: { documentId: 'some-id' } }),
}))

jest.mock('@/hooks/useConfig', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    config: {
      document: {
        roles: ['role1', 'role2'],
        types: ['type1', 'type2'],
        variants: ['variant1', 'variant2'],
      },
      languages: {
        en: 'English',
        es: 'Spanish',
      },
    },
    loading: false,
    error: null,
  })),
}))

const onDocumentFormSuccess = jest.fn()

const mockDocument: IDocument = {
  import_id: '12345',
  family_import_id: '67890',
  variant_name: 'Variant Name',
  status: 'Active',
  role: 'Editor',
  type: 'PDF',
  slug: 'document-slug',
  physical_id: 101,
  title: 'Sample Document Title',
  md5_sum: '1a79a4d60de6718e8e5b326e338ae533',
  cdn_object: 'cdn/path/to/document',
  source_url: 'http://example.com/document',
  content_type: 'application/pdf',
  user_language_name: 'English',
}

// Tests
describe('DocumentForm', () => {
  it('validate incorrect document URL', async () => {
    render(
      <React.StrictMode>
        <ChakraProvider>
          <DocumentForm
            familyId={'test'}
            onSuccess={onDocumentFormSuccess}
            document={mockDocument}
          />
        </ChakraProvider>
      </React.StrictMode>,
    )

    const input = screen.getByRole('textbox', { name: /source url/i })
    const submitButton = screen.getByText('Update Document')

    const newUrl = 'test-no-url'
    fireEvent.change(input, { target: { value: newUrl } })
    await waitFor(() => {
      expect(input).toHaveValue(newUrl)
    })
    fireEvent.submit(submitButton)

    await waitFor(() => {
      const errorMessage = screen.getByRole('error')
      expect(errorMessage).toBeInTheDocument()
    })
  })

  it('validate correct document URL', async () => {
    render(
      <React.StrictMode>
        <ChakraProvider>
          <DocumentForm
            familyId={'test'}
            onSuccess={onDocumentFormSuccess}
            document={mockDocument}
          />
        </ChakraProvider>
      </React.StrictMode>,
    )

    const input = screen.getByRole('textbox', { name: /source url/i })
    const submitButton = screen.getByText('Update Document')

    const newUrl = 'http://source.com'
    fireEvent.change(input, { target: { value: newUrl } })
    await waitFor(() => {
      expect(input).toHaveValue(newUrl)
    })
    fireEvent.submit(submitButton)

    await waitFor(() => {
      expect(onDocumentFormSuccess).toHaveBeenCalled()
    })
  })
})
