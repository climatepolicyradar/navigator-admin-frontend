import { Control, FieldErrors } from 'react-hook-form'
import { ITaxonomyField } from './Config'

export enum FieldType {
  TEXT = 'text',
  MULTI_SELECT = 'multi_select',
  SINGLE_SELECT = 'single_select',
  NUMBER = 'number',
  DATE = 'date',
}

export interface MetadataFieldConfig {
  type: FieldType
  label?: string
  allowedValues?: string[]
}

export interface CorpusInfo {
  corpus_type: string
  title?: string // TODO Do we need this?
}

// Enhanced configuration type for corpus metadata
export interface CorpusMetadataConfig {
  [corpusType: string]: {
    renderFields: Record<string, MetadataFieldConfig>
    validationFields: string[]
  }
}

export interface SelectOption {
  value: string
  label: string
}

export interface DynamicMetadataFieldProps<T extends Record<string, any>> {
  fieldKey: string
  taxonomyField: ITaxonomyField
  control: Control<T>
  errors: FieldErrors<T>
  fieldType: FieldType
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
  default: {
    renderFields: {},
    validationFields: [],
  },
}
