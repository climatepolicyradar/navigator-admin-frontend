export interface ICorpusType {
  name: string
  description: string
}

export interface ICorpusTypeMetadata {
  allowBlanks: string
  allowAny: string
  allowedValues?: string[]
  fieldName: string
}

export interface ICorpusTypeWithMeta {
  name: string
  description: string
  metadata?: ICorpusTypeMetadata
}
