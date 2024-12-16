import { OptionBase } from 'chakra-react-select'

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
export interface IChakraSelect extends OptionBase {
  value: string
  label: string
}

export interface IConfigLanguageSorted extends IChakraSelect {}

export interface IConfigCorpus extends IChakraSelect {}

export interface IConfigLanguageSorted extends OptionBase {
  value: string
  label: string
}

interface IConfigMeta {
  allow_any?: boolean
  allow_blanks: boolean
  allowed_values: string[]
}

export interface IConfigTaxonomyCCLW {
  topic: IConfigMeta
  hazard: IConfigMeta
  sector: IConfigMeta
  keyword: IConfigMeta
  framework: IConfigMeta
  instrument: IConfigMeta
  event_type: IConfigMeta
  _document: IConfigDocumentMetadata
}

export interface IConfigTaxonomyUNFCCC {
  author: IConfigMeta
  author_type: IConfigMeta
  event_type: IConfigMeta
  _document: IConfigDocumentMetadata
}

export type IConfigTaxonomyMCF =
  | IConfigTaxonomyGCF
  | IConfigTaxonomyAF
  | IConfigTaxonomyGEF
  | IConfigTaxonomyCIF

type IConfigMCFBaseTaxonomy = {
  event_type: IConfigMeta
  implementing_agency: IConfigMeta
  project_id: IConfigMeta
  project_url: IConfigMeta
  project_value_co_financing: IConfigMeta
  project_value_fund_spend: IConfigMeta
  region: IConfigMeta
  status: IConfigMeta
  _document: IConfigDocumentMetadata
  _event: IConfigEventMetadata
}

// Extend base type for specific taxonomies
type IConfigTaxonomyGCF = IConfigMCFBaseTaxonomy & {
  approved_ref: IConfigMeta
  result_area: IConfigMeta
  result_type: IConfigMeta
  sector: IConfigMeta
  theme: IConfigMeta
}

type IConfigTaxonomyCIF = IConfigMCFBaseTaxonomy & {
  sector: IConfigMeta
}

type IConfigTaxonomyGEF = IConfigMCFBaseTaxonomy & {
  focal_area: IConfigMeta
}

type IConfigTaxonomyAF = IConfigMCFBaseTaxonomy & {
  sector: IConfigMeta
}

export interface IConfigDocumentMetadata {
  role?: IConfigMeta
  type?: IConfigMeta
}

export interface IConfigEventMetadata {
  datetime_event_name: IConfigMeta
  event_type: IConfigMeta
}

export interface IConfigOrganisationMetadata {
  name: string
  id: number
}

export interface IConfigCorpora {
  corpus_import_id: string
  title: string
  description: string
  corpus_type: string
  corpus_type_description: string
  organisation: IConfigOrganisationMetadata
  taxonomy: IConfigTaxonomyCCLW | IConfigTaxonomyUNFCCC | IConfigTaxonomyMCF
}

export interface IConfig {
  geographies: IConfigGeography[]
  languages: {
    [key: string]: string
  }
  languagesSorted: IConfigLanguageSorted[]
  corpora: IConfigCorpora[]
  document: {
    roles: string[]
    types: string[]
    variants: string[]
  }
}
