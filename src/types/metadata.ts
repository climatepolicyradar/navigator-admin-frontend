import { Control, FieldErrors } from 'react-hook-form'
import * as yup from 'yup'

export enum FieldType {
  TEXT = 'text',
  MULTI_SELECT = 'multi_select',
  SINGLE_SELECT = 'single_select',
  NUMBER = 'number',
  DATE = 'date',
}

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
  title?: string
}

export interface MetadataFieldConfig {
  type: FieldType
  label?: string
  allowedValues?: string[]
}

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

export type ValidationSchema = yup.ObjectSchema<any>
