import { TOrganisation } from './Organisation'
export type TCorpusType = 'Intl. agreements' | 'Laws and Policies'

export interface ICorpus {
  import_id: string
  title: string
  description: string
  corpus_type_name: TCorpusType
  corpus_type_description: string
  corpus_text: string | null
  corpus_image_url: string | null
  organisation_id: number
  organisation_name: TOrganisation
}

export interface ICorpusFormPost {
  title: string
  description?: string
  corpus_text?: string
  corpus_image_url?: string
  corpus_type_name?: string
  corpus_type_description?: string
}
