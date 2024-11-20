import { IConfigCorpus } from './Config'
import { TOrganisation } from './Organisation'

export interface ICorpus {
  import_id: string
  title: string
  description: string
  corpus_type_name?: string
  corpus_type_description: string
  corpus_text: string | null
  corpus_image_url: string | null
  organisation_id: number
  organisation_name: TOrganisation
}

export interface ICorpusFormPost {
  title: string
  description: string
  corpus_text: string | null
  corpus_image_url: string | null
  corpus_type_name?: IConfigCorpus
  corpus_type_description: string
}

export interface ICorpusFormPut {
  title: string
  description?: string
  corpus_text?: string
  corpus_image_url?: string
  // corpus_type_name?: IConfigCorpus
  // corpus_type_description?: string
}
