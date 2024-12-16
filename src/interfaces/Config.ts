import { IChakraSelect } from '.'

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

// Types for taxonomy and corpus info
export interface ITaxonomyField {
  allowed_values?: string[]
  allow_any?: boolean
  allow_blanks?: boolean
}

export interface ISubTaxonomy {
  [key: string]: ITaxonomyField
}

export interface IDocumentSubTaxonomy extends ISubTaxonomy {
  role: ITaxonomyField
  type: ITaxonomyField
}

export interface IMcfDocumentSubTaxonomy extends ISubTaxonomy {
  type: ITaxonomyField
}

export interface IEventSubTaxonomy extends ISubTaxonomy {
  // datetime_event_name: ITaxonomyField
  event_type: ITaxonomyField
}

export type TSubTaxonomy = IEventSubTaxonomy | IDocumentSubTaxonomy | IMcfDocumentSubTaxonomy

interface ITaxonomy {
  [key: string]: ITaxonomyField | TSubTaxonomy
}

export interface IConfigTaxonomyCCLW extends ITaxonomy {
  topic: ITaxonomyField
  hazard: ITaxonomyField
  sector: ITaxonomyField
  keyword: ITaxonomyField
  framework: ITaxonomyField
  instrument: ITaxonomyField
  event_type: ITaxonomyField
  _document: IDocumentSubTaxonomy
  _event: IEventSubTaxonomy
}

export interface IConfigTaxonomyUNFCCC extends ITaxonomy {
  author: ITaxonomyField
  author_type: ITaxonomyField
  event_type: ITaxonomyField
  _document: IDocumentSubTaxonomy
  _event: IEventSubTaxonomy
}

export type TTaxonomy =
  | IConfigTaxonomyCCLW
  | IConfigTaxonomyUNFCCC
  | IConfigTaxonomyMCF

export type IConfigTaxonomyMCF =
  | IConfigTaxonomyGCF
  | IConfigTaxonomyAF
  | IConfigTaxonomyGEF
  | IConfigTaxonomyCIF

interface IConfigMCFBaseTaxonomy extends ITaxonomy {
  event_type: ITaxonomyField
  implementing_agency: ITaxonomyField
  project_id: ITaxonomyField
  project_url: ITaxonomyField
  project_value_co_financing: ITaxonomyField
  project_value_fund_spend: ITaxonomyField
  region: ITaxonomyField
  status: ITaxonomyField
  _document: IMcfDocumentSubTaxonomy
  _event: IEventSubTaxonomy
}

// Extend MCFbase type for specific taxonomies
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

export interface IConfigOrganisationInfo {
  name: string
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
