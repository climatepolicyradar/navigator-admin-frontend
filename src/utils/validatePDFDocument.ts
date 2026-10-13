const PDF_SIGNATURE = '%PDF-'
const SIGNATURE_SEARCH_BYTES = 1024
export const MAX_PDF_FILES_PER_REQUEST = 10

async function hasPdfSignature(file: File): Promise<boolean> {
  const buffer = await file.slice(0, SIGNATURE_SEARCH_BYTES).arrayBuffer()
  const header = new TextDecoder('latin1').decode(buffer)
  return header.includes(PDF_SIGNATURE)
}

export async function validatePdfFiles(files: File[]): Promise<string | null> {
  if (files.length < 1 || files.length > MAX_PDF_FILES_PER_REQUEST) {
    return `Select between 1 and ${MAX_PDF_FILES_PER_REQUEST} files.`
  }

  for (const file of files) {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return `${file.name} is not a PDF.`
    }
    if (file.size === 0) {
      return `${file.name} is empty.`
    }
    if (!(await hasPdfSignature(file))) {
      return `${file.name} is not a valid PDF.`
    }
  }

  return null
}
