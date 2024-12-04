import * as yup from 'yup'

// Enum for field types to ensure type safety and scalability
export enum FieldType {
  TEXT = 'text',
  MULTI_SELECT = 'multi_select',
  SINGLE_SELECT = 'single_select',
  NUMBER = 'number',
  DATE = 'date',
}

// Enhanced configuration type for corpus metadata
export type CorpusMetadataConfig = {
  [corpusType: string]: {
    renderFields: {
      [fieldKey: string]: {
        type: FieldType
        label?: string
        allowedValues?: string[]
      }
    }
    validationFields: string[]
  }
}

// Centralised configuration for corpus metadata
export const CORPUS_METADATA_CONFIG: CorpusMetadataConfig = {
  'Intl. agreements': {
    renderFields: {
      author: { type: FieldType.TEXT },
      author_type: { type: FieldType.SINGLE_SELECT },
    },
    validationFields: ['author', 'author_type'],
  },
  'Laws and Policies': {
    renderFields: {
      topic: { type: FieldType.MULTI_SELECT },
      hazard: { type: FieldType.MULTI_SELECT },
      sector: { type: FieldType.MULTI_SELECT },
      keyword: { type: FieldType.MULTI_SELECT },
      framework: { type: FieldType.MULTI_SELECT },
      instrument: { type: FieldType.MULTI_SELECT },
    },
    validationFields: [
      'topic',
      'hazard',
      'sector',
      'keyword',
      'framework',
      'instrument',
    ],
  },
  AF: {
    renderFields: {
      region: { type: FieldType.MULTI_SELECT },
      sector: { type: FieldType.MULTI_SELECT },
      implementing_agency: { type: FieldType.MULTI_SELECT },
      status: { type: FieldType.SINGLE_SELECT },
      project_id: { type: FieldType.TEXT },
      project_url: { type: FieldType.TEXT },
      project_value_co_financing: { type: FieldType.NUMBER },
      project_value_fund_spend: { type: FieldType.NUMBER },
    },
    validationFields: [
      'project_id',
      'project_url',
      'region',
      'sector',
      'status',
      'implementing_agency',
      'project_value_co_financing',
      'project_value_fund_spend',
    ],
  },
  default: {
    renderFields: {},
    validationFields: [],
  },
}

// Types for taxonomy and corpus info
export interface TaxonomyField {
  allowed_values?: string[]
  allow_any?: boolean
  allow_blanks?: boolean
}

export interface Taxonomy {
  [key: string]: TaxonomyField
}

export interface CorpusInfo {
  corpus_type: string
}

type ValidationSchema = yup.ObjectSchema<any>

// Validation schema generation utility
export const generateDynamicValidationSchema = (
  taxonomy: Taxonomy,
  corpusInfo: CorpusInfo,
  schema: ValidationSchema,
): ValidationSchema => {
  if (!taxonomy) return schema

  const metadataValidation = CORPUS_METADATA_CONFIG[
    corpusInfo?.corpus_type
  ]?.validationFields.reduce<Record<string, yup.Schema>>((acc, fieldKey) => {
    const taxonomyField = taxonomy[fieldKey]
    const renderField =
      CORPUS_METADATA_CONFIG[corpusInfo?.corpus_type]?.renderFields[fieldKey]

    if (taxonomyField) {
      // Determine validation based on field type and allow_blanks
      switch (renderField?.type) {
        case FieldType.TEXT:
          acc[fieldKey] = taxonomyField.allow_blanks
            ? yup.string()
            : yup.string().required(`${fieldKey} is required`)
          break
        case FieldType.MULTI_SELECT:
          acc[fieldKey] = taxonomyField.allow_blanks
            ? yup.array().of(yup.string())
            : yup.array().of(yup.string()).min(1, `${fieldKey} is required`)
          break
        case FieldType.SINGLE_SELECT:
          acc[fieldKey] = taxonomyField.allow_blanks
            ? yup.string()
            : yup.string().required(`${fieldKey} is required`)
          break
        case FieldType.NUMBER:
          acc[fieldKey] = taxonomyField.allow_blanks
            ? yup.number()
            : yup.number().required(`${fieldKey} is required`)
          break
        case FieldType.DATE:
          acc[fieldKey] = taxonomyField.allow_blanks
            ? yup.date()
            : yup.date().required(`${fieldKey} is required`)
          break
        default:
          // Fallback for unspecified types
          acc[fieldKey] = yup.string()
      }
    }

    return acc
  }, {})

  return schema.shape(metadataValidation)
}
