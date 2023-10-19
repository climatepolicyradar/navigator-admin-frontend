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

interface IConfigMeta {
  allow_any?: boolean
  allow_blanks: boolean
  allowed_values: string[]
}

export interface IConfig {
  geographies: IConfigGeography[]
  languages: {
    [key: string]: string
  }
  taxonomies: {
    CCLW: {
      topic: IConfigMeta
      hazard: IConfigMeta
      sector: IConfigMeta
      keyword: IConfigMeta
      framework: IConfigMeta
      instrument: IConfigMeta
    }
    UNFCCC: {
      author: IConfigMeta
      author_type: IConfigMeta
    }
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
