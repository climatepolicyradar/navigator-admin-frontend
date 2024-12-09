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

export interface IConfigLanguageSorted extends IChakraSelect {}

// Types for taxonomy and corpus info
export interface ITaxonomyField {
  allowed_values?: string[]
  allow_any?: boolean
  allow_blanks?: boolean
}

interface ISubTaxonomy {
  [key: string]: ITaxonomyField
}

export interface IDocumentSubTaxonomy extends ISubTaxonomy {
  role: ITaxonomyField
  type: ITaxonomyField
}

export interface IEventSubTaxonomy extends ISubTaxonomy {
  event_type: ITaxonomyField
}

export type TSubTaxonomy = IEventSubTaxonomy | IDocumentSubTaxonomy

export interface ITaxonomy {
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

export type TTaxonomy = IConfigTaxonomyCCLW | IConfigTaxonomyUNFCCC

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
  languagesSorted: IConfigLanguageSorted[]
  corpora: IConfigCorpora[]
  document: {
    roles: string[]
    types: string[]
    variants: string[]
  }
}
