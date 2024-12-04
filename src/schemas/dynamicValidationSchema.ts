import * as yup from 'yup'
import {
  FieldType,
  Taxonomy,
  CorpusInfo,
  CorpusMetadataConfig,
  ValidationSchema,
} from '@/types/metadata'

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

const getFieldValidation = (
  fieldType: FieldType,
  isRequired: boolean,
  fieldKey: string,
): yup.Schema => {
  switch (fieldType) {
    case FieldType.TEXT:
      return isRequired
        ? yup.string().required(`${fieldKey} is required`)
        : yup.string()
    case FieldType.MULTI_SELECT:
      return isRequired
        ? yup.array().of(yup.string()).min(1, `${fieldKey} is required`)
        : yup.array().of(yup.string())
    case FieldType.SINGLE_SELECT:
      return isRequired
        ? yup.string().required(`${fieldKey} is required`)
        : yup.string()
    case FieldType.NUMBER:
      return isRequired
        ? yup.number().required(`${fieldKey} is required`)
        : yup.number()
    case FieldType.DATE:
      return isRequired
        ? yup.date().required(`${fieldKey} is required`)
        : yup.date()
    default:
      return yup.string()
  }
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

export const generateDynamicValidationSchema = (
  taxonomy: Taxonomy | null,
  corpusInfo: CorpusInfo | null,
): yup.ObjectSchema<any> => {
  if (!taxonomy || !corpusInfo) {
    return yup.object({}).required()
  }

  const metadataFields = CORPUS_METADATA_CONFIG[corpusInfo.corpus_type]?.renderFields || {}
  const validationFields = CORPUS_METADATA_CONFIG[corpusInfo.corpus_type]?.validationFields || []

  const schemaShape = Object.entries(metadataFields).reduce((acc, [fieldKey, fieldConfig]) => {
    // Get the field's taxonomy configuration
    const taxonomyField = taxonomy[fieldKey]
    const isRequired = validationFields.includes(fieldKey)

    // Generate field validation based on field type and requirements
    let fieldValidation: yup.Schema
    switch (fieldConfig.type) {
      case FieldType.MULTI_SELECT:
        fieldValidation = yup.array().of(
          yup.object({
            value: yup.string(),
            label: yup.string(),
          })
        )
        break
      case FieldType.SINGLE_SELECT:
        fieldValidation = yup.string()
        break
      case FieldType.TEXT:
        fieldValidation = yup.string()
        break
      case FieldType.NUMBER:
        fieldValidation = yup.number()
        break
      case FieldType.DATE:
        fieldValidation = yup.date()
        break
      default:
        fieldValidation = yup.mixed()
    }

    // Add required validation if needed
    if (isRequired) {
      fieldValidation = fieldValidation.required(`${fieldKey} is required`)
    }

    // Add allowed values validation if specified in taxonomy
    if (taxonomyField?.allowed_values && !taxonomyField.allow_any) {
      if (fieldConfig.type === FieldType.MULTI_SELECT) {
        fieldValidation = fieldValidation.test(
          'allowed-values',
          `${fieldKey} contains invalid values`,
          (value) => {
            if (!value) return true
            return value.every((item: any) => 
              taxonomyField.allowed_values?.includes(item.value)
            )
          }
        )
      } else {
        fieldValidation = fieldValidation.oneOf(
          taxonomyField.allowed_values,
          `${fieldKey} must be one of the allowed values`
        )
      }
    }

    return {
      ...acc,
      [fieldKey]: fieldValidation,
    }
  }, {})

  return yup.object(schemaShape).required()
}
