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
  { name: 'data_provider', description: 'Name of the data provider.' },
]

export const REQUIRED_COLUMNS = REQUIRED_FIELDS.map((f) => f.name)

export interface CsvValidationResult {
  errors: UploadError[]
  /** Value of data_provider in the first data row. Only set when there are no errors. */
  dataProvider?: string
}

const DATA_PROVIDER_COLUMN = 'data_provider'

const normalise = (value: unknown): string =>
  String(value ?? '')
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase()

/** Parses only the header row and the first data row. */
const readFirstRows = (file: File): Promise<string[][]> =>
  new Promise((resolve, reject) => {
    Papa.parse<string[]>(file, {
      preview: 2, // header row + first data row
      delimiter: ',', // be strict rather than auto-detecting ; \t | etc.
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    })
  })

export async function validateCsvColumns(
  file: File,
): Promise<CsvValidationResult> {
  let rows: string[][]

  try {
    rows = await readFirstRows(file)
  } catch (error) {
    console.error('validateCsvColumns read failed:', error)
    return {
      errors: [{ field: 'file', message: 'The file could not be read.' }],
    }
  }

  const [rawHeaders, firstRow] = rows

  if (!rawHeaders?.length) {
    return {
      errors: [
        { field: 'headers', message: 'The file contains no header row.' },
      ],
    }
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

  // Only look at row content once the headers are sound
  if (errors.length) return { errors }

  if (!firstRow) {
    return {
      errors: [
        {
          field: DATA_PROVIDER_COLUMN,
          message: `The file has no data rows, so ${DATA_PROVIDER_COLUMN} cannot be determined.`,
        },
      ],
    }
  }

  const dataProvider = String(
    firstRow[headers.indexOf(DATA_PROVIDER_COLUMN)] ?? '',
  ).trim()

  if (!dataProvider) {
    return {
      errors: [
        {
          row: 2, // the first data row, as the user sees it in a spreadsheet
          field: DATA_PROVIDER_COLUMN,
          message: `${DATA_PROVIDER_COLUMN} is empty. It must be filled in on the first row.`,
        },
      ],
    }
  }

  return { errors, dataProvider }
}
