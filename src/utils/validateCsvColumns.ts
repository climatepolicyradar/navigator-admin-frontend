import Papa from 'papaparse'
import type { UploadError } from '@/interfaces/UploadError'

type RequiredField = { name: string; description: string }

export const REQUIRED_FIELDS: RequiredField[] = [
  { name: 'document_id', description: 'Unique identifier for the document.' },
  { name: 'document_title', description: 'Document title.' },
  { name: 'parent_document_id', description: 'Required for child documents.' },
  { name: 'geography', description: 'Paired with geography_code.' },
  {
    name: 'geography_code',
    description: 'ISO 3166 code. Paired with geography_name.',
  },
  { name: 'language', description: 'Paired with language_code.' },
  {
    name: 'language_code',
    description: 'ISO 639 code. Paired with language_name.',
  },
]

export const REQUIRED_COLUMNS = REQUIRED_FIELDS.map((f) => f.name)

const normalise = (value: unknown): string =>
  String(value ?? '')
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase()

/** Parses only the first row of the file. */
const readFirstRow = (file: File): Promise<string[] | undefined> =>
  new Promise((resolve, reject) => {
    Papa.parse<string[]>(file, {
      preview: 1, // only the header row is parsed
      delimiter: ',', // be strict rather than auto-detecting ; \t | etc.
      complete: (results) => resolve(results.data[0]),
      error: (error) => reject(error),
    })
  })

export async function validateCsvColumns(file: File): Promise<UploadError[]> {
  let rawHeaders: string[] | undefined

  try {
    rawHeaders = await readFirstRow(file)
  } catch (error) {
    console.error('validateCsvColumns read failed:', error)
    return [{ field: 'file', message: 'The file could not be read.' }]
  }

  if (!rawHeaders?.length) {
    return [{ field: 'headers', message: 'The file contains no header row.' }]
  }

  const headers = rawHeaders.map(normalise)
  const errors: UploadError[] = []

  const missing = REQUIRED_COLUMNS.filter((c) => !headers.includes(c))
  if (missing.length) {
    errors.push({
      field: 'headers',
      message: `Missing required columns: ${missing.join(', ')}`,
    })
  }

  const seen = new Set<string>()
  const duplicates = new Set<string>()
  for (const header of headers) {
    if (!header) continue
    if (seen.has(header)) duplicates.add(header)
    else seen.add(header)
  }
  if (duplicates.size) {
    errors.push({
      field: 'headers',
      message: `Duplicate columns: ${[...duplicates].join(', ')}`,
    })
  }

  return errors
}
