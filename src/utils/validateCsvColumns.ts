import { read, utils, type WorkBook } from 'xlsx'
import type { UploadError } from '@/interfaces/UploadError'

type RequiredField = { name: string; description: string }

export const REQUIRED_FIELDS: RequiredField[] = [
  { name: 'document_id', description: 'Unique identifier for the document.' },
  { name: 'title', description: 'Document title.' },
  { name: 'parent_id', description: 'Required for child documents.' },
  { name: 'geography_name', description: 'Paired with geography_code.' },
  {
    name: 'geography_code',
    description: 'ISO 3166 code. Paired with geography_name.',
  },
  { name: 'language_name', description: 'Paired with language_code.' },
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

export async function validateCsvColumns(file: File): Promise<UploadError[]> {
  if (file.size === 0) {
    return [{ field: 'file', message: 'The file is empty.' }]
  }

  let wb: WorkBook

  try {
    // sheetRows: 1 → only the header row is parsed
    wb = read(await file.arrayBuffer(), { sheetRows: 1 })
  } catch {
    return [{ field: 'file', message: 'The file could not be read.' }]
  }

  const ws = wb.Sheets[wb.SheetNames[0]]

  if (!ws) {
    return [{ field: 'file', message: 'The file contains no readable data.' }]
  }

  const [rawHeaders] = utils.sheet_to_json<unknown[]>(ws, {
    header: 1,
    defval: '',
  })

  if (!rawHeaders?.length) {
    return [{ field: 'headers', message: 'The file contains no header row.' }]
  }

  // Array.from turns any holes in a sparse array into '' rather than skipping them
  const headers = Array.from(rawHeaders, normalise)
  const errors: UploadError[] = []

  const missing = REQUIRED_COLUMNS.filter((column) => !headers.includes(column))

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
