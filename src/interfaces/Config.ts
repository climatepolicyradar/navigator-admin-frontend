import { IChakraSelect } from '.'

// Base types for taxonomies.
export interface ITaxonomyField {
  allowed_values?: string[]
  allow_any?: boolean
  allow_blanks?: boolean
}

export interface ISubTaxonomy {
  [key: string]: ITaxonomyField
}

// Document sub-taxonomies.
export interface IDefaultDocSubTaxonomy extends ISubTaxonomy {
  role: ITaxonomyField
  type: ITaxonomyField
}

export interface IReportsDocSubTaxonomy extends ISubTaxonomy {
  type: ITaxonomyField
}

export interface IGcfDocSubTaxonomy extends ISubTaxonomy {
  type: ITaxonomyField
}

export interface IEmptyDocumentSubTaxonomy {}

export type TMcfDocumentSubTaxonomy =
  | IEmptyDocumentSubTaxonomy
  | IGcfDocSubTaxonomy

export type TDocumentSubTaxonomy =
  | IDefaultDocSubTaxonomy
  | TMcfDocumentSubTaxonomy

// Event sub-taxonomies.
export interface IEventSubTaxonomy extends ISubTaxonomy {
  event_type: ITaxonomyField
}

// Taxonomy builder.
export type TSubTaxonomy = IEventSubTaxonomy | TDocumentSubTaxonomy

interface ITaxonomy {
  [key: string]: ITaxonomyField | TSubTaxonomy
}

// Corpus type specific taxonomies.
export interface IConfigTaxonomyCCLW extends ITaxonomy {
  topic: ITaxonomyField
  hazard: ITaxonomyField
  sector: ITaxonomyField
  keyword: ITaxonomyField
  framework: ITaxonomyField
  instrument: ITaxonomyField
  _document: IDefaultDocSubTaxonomy
  _event: IEventSubTaxonomy
}

export interface IConfigTaxonomyUNFCCC extends ITaxonomy {
  author: ITaxonomyField
  author_type: ITaxonomyField
  _document: IDefaultDocSubTaxonomy
  _event: IEventSubTaxonomy
}

export interface IConfigReportsTaxonomy extends ITaxonomy {
  author: ITaxonomyField
  author_type: ITaxonomyField
  _document: IReportsDocSubTaxonomy
  _event: IEventSubTaxonomy
}

interface IConfigMCFBaseTaxonomy extends ITaxonomy {
  implementing_agency: ITaxonomyField
  project_id: ITaxonomyField
  project_url: ITaxonomyField
  project_value_co_financing: ITaxonomyField
  project_value_fund_spend: ITaxonomyField
  region: ITaxonomyField
  status: ITaxonomyField
  _document: TMcfDocumentSubTaxonomy
  _event: IEventSubTaxonomy
}

// Extend MCF base type for specific taxonomies
type IConfigTaxonomyGCF = IConfigMCFBaseTaxonomy & {
  approved_ref: ITaxonomyField
  result_area: ITaxonomyField
  result_type: ITaxonomyField
  sector: ITaxonomyField
  theme: ITaxonomyField
}

type IConfigTaxonomyCIF = IConfigMCFBaseTaxonomy & {
  sector: ITaxonomyField
}

type IConfigTaxonomyGEF = IConfigMCFBaseTaxonomy & {
  focal_area: ITaxonomyField
}

type IConfigTaxonomyAF = IConfigMCFBaseTaxonomy & {
  sector: ITaxonomyField
}

export type IConfigTaxonomyMCF =
  | IConfigTaxonomyGCF
  | IConfigTaxonomyAF
  | IConfigTaxonomyGEF
  | IConfigTaxonomyCIF

export type TTaxonomy =
  | IConfigTaxonomyCCLW
  | IConfigTaxonomyUNFCCC
  | IConfigTaxonomyMCF
  | IConfigReportsTaxonomy

// Config endpoint types.
export interface IConfigGeographyNode {
  id: number
  display_value: string
  slug: string
  value: string
  type: string
  parent_id: number
}

export interface IConfigGeography {
  node: IConfigGeographyNode
  children: IConfigGeography[]
}

export interface IConfigOrganisationInfo {
  name: string
  display_name: string
  type: string
  id: number
}

export interface IConfigCorpora {
  corpus_import_id: string
  title: string
  description: string
  corpus_type: string
  corpus_type_description: string
  organisation: IConfigOrganisationInfo
  taxonomy: TTaxonomy
}

export interface IConfig {
  geographies: IConfigGeography[]
  languages: {
    [key: string]: string
  }
  languagesSorted: IChakraSelect[]
  corpora: IConfigCorpora[]
  document: {
    roles: string[]
    types: string[]
    variants: string[]
  }
}
