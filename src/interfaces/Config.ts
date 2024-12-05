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
  _event: IConfigEventMetadata
}

export interface IConfigTaxonomyUNFCCC {
  author: IConfigMeta
  author_type: IConfigMeta
  event_type: IConfigMeta
  _document: IConfigDocumentMetadata
  _event: IConfigEventMetadata
}

export type TTaxonomy = IConfigTaxonomyCCLW | IConfigTaxonomyUNFCCC

export interface IConfigEventMetadata {
  event_type: IConfigMeta
}
export interface IConfigDocumentMetadata {
  role: IConfigMeta
  type: IConfigMeta
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
  taxonomy: TTaxonomy
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
