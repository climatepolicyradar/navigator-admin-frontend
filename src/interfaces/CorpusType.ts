import { TTaxonomy } from './Config'

export interface ICorpusType {
  name: string
  description: string
}

export interface ICorpusTypeWithMeta {
  name: string
  description: string
  metadata?: TTaxonomy
}
