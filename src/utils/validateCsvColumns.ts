import Papa from 'papaparse'
import type { UploadError } from '@/interfaces/UploadError'

type RequiredField = { name: string; description: string; required: boolean }

export const REQUIRED_FIELDS: RequiredField[] = [
  {
    name: 'document_id',
    description: 'Unique identifier for the document.',
    required: true,
  },
  {
    name: 'document_title',
    description: 'The name of the law, policy or document.',
    required: true,
  },
  {
    name: 'alternative_titles',
    description: 'Any other names the same document goes by.',
    required: false,
  },
  {
    name: 'document_function',
    description: 'Is it the main document or an amendment, annex etc.?',
    required: true,
  },
  {
    name: 'summary',
    description: 'A brief description of what the document does.',
    required: false,
  },
  {
    name: 'reference_number',
    description: 'Official reference number.',
    required: false,
  },
  {
    name: 'external_identifiers',
    description: 'Reference numbers from external systems, as SOURCE::ID.',
    required: false,
  },
  {
    name: 'entity_type',
    description: 'Is this a Law or a Policy?',
    required: true,
  },
  {
    name: 'event_type',
    description: 'What happened to this document?',
    required: true,
  },
  {
    name: 'event_date',
    description: 'When the event happened, as YYYY-MM-DD.',
    required: true,
  },
  {
    name: 'event_description',
    description: 'Extra context about the event.',
    required: false,
  },
  {
    name: 'region',
    description: 'Region the document applies to.',
    required: false,
  },
  {
    name: 'region_code',
    description: 'Code for the region.',
    required: false,
  },
  {
    name: 'geography',
    description: 'Which country or countries. Paired with geography_code.',
    required: true,
  },
  {
    name: 'geography_code',
    description: 'ISO 3166 code. Automated from geography.',
    required: false,
  },
  {
    name: 'subdivision',
    description: 'Which sub-division.',
    required: false,
  },
  {
    name: 'subdivision_code',
    description: 'Automated from subdivision.',
    required: false,
  },
  {
    name: 'domain',
    description: 'Subject area, either Climate or Nature.',
    required: false,
  },
  {
    name: 'response_areas',
    description: 'One or more response areas.',
    required: false,
  },
  {
    name: 'data_provider',
    description: 'Who gave you this data.',
    required: false,
  },

  {
    name: 'accreditation_text',
    description: 'Accreditation text for the data provider.',
    required: false,
  },

  {
    name: 'attribution_url',
    description: 'Link to the data provider’s attribution page.',
    required: false,
  },

  {
    name: 'accreditation_logo',
    description: 'Logo for the data provider. CDN-hosted image URL.',
    required: false,
  },
  {
    name: 'source_url',
    description: 'Where people can find the document online.',
    required: true,
  },
  {
    name: 'document_type',
    description: 'What kind of document it is.',
    required: true,
  },
  {
    name: 'type',
    description:
      'How broad it is: Laws, Policies, or Rules, regulations and guidelines.',
    required: true,
  },
  {
    name: 'variant',
    description: 'Is this the original or a translation?',
    required: true,
  },
  {
    name: 'language',
    description: 'Language(s) it is written in. Paired with language_code.',
    required: true,
  },
  {
    name: 'language_code',
    description: 'ISO 639 code.',
    required: false,
  },
  {
    name: 'parent_document_id',
    description: 'Amendments only: the main document being amended.',
    required: false,
  },
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
