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
}

export interface IConfigTaxonomyUNFCCC {
  author: IConfigMeta
  author_type: IConfigMeta
  event_type: IConfigMeta
}

export interface IConfigCorpora {
  corpus_import_id: string
  title: string
  description: string
  corpus_type: string
  corpus_type_description: string
  taxonomy: IConfigTaxonomyCCLW | IConfigTaxonomyUNFCCC
}

export interface IConfig {
  geographies: IConfigGeography[]
  languages: {
    [key: string]: string
  }
  languagesSorted: IConfigLanguageSorted[]
  corpora: IConfigCorpora[]
  taxonomies: {
    CCLW: IConfigTaxonomyCCLW
    UNFCCC: IConfigTaxonomyUNFCCC
  }
  document: {
    roles: string[]
    types: string[]
    variants: string[]
  }
  event: {
    types: string[]
  }
}
