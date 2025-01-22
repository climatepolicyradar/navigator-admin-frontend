import { IChakraSelect } from '.'

export enum FieldType {
  TEXT = 'text',
  MULTI_SELECT = 'multi_select',
  SINGLE_SELECT = 'single_select',
  NUMBER = 'number',
  DATE = 'date',
  TAG_INPUT = 'tag_input',
}

export interface IMetadata {
  [key: string]: string[]
}

export interface IFormMetadata {
  [key: string]:
    | string
    | IChakraSelect[]
    | IChakraSelect
    | string[]
    | number
    | undefined
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

// Centralised configuration for corpus type metadata.
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
  CIF: {
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
  GCF: {
    renderFields: {
      region: { type: FieldType.MULTI_SELECT },
      sector: { type: FieldType.MULTI_SELECT },
      implementing_agency: { type: FieldType.MULTI_SELECT },
      result_area: { type: FieldType.MULTI_SELECT },
      result_type: { type: FieldType.MULTI_SELECT },
      theme: { type: FieldType.MULTI_SELECT },
      status: { type: FieldType.SINGLE_SELECT },
      project_id: { type: FieldType.TEXT },
      project_url: { type: FieldType.TEXT },
      project_value_co_financing: { type: FieldType.NUMBER },
      project_value_fund_spend: { type: FieldType.NUMBER },
      approved_ref: { type: FieldType.NUMBER },
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
      'approved_ref',
      'result_area',
      'result_type',
      'theme',
    ],
  },
  GEF: {
    renderFields: {
      region: { type: FieldType.MULTI_SELECT },
      focal_area: { type: FieldType.MULTI_SELECT },
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
      'focal_area',
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
  Reports: {
    renderFields: {
      author: { type: FieldType.TEXT },
      author_type: { type: FieldType.SINGLE_SELECT },
      external_id: { type: FieldType.TEXT },
    },
    validationFields: ['author', 'author_type', 'external_id'],
  },
}
