import { Control, FieldErrors } from 'react-hook-form'

export enum FieldType {
  TEXT = 'text',
  MULTI_SELECT = 'multi_select',
  SINGLE_SELECT = 'single_select',
  NUMBER = 'number',
  DATE = 'date',
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

export interface SubTaxonomy {
  [key: string]: Taxonomy
}

export interface CorpusInfo {
  corpus_type: string
  title?: string // TODO Do we need this?
}

export interface MetadataFieldConfig {
  type: FieldType
  label?: string
  allowedValues?: string[]
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
  taxonomyField: TaxonomyField
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
