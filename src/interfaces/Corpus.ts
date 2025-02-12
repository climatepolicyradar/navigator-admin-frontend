export interface ICorpus {
  import_id: string
  title: string
  description: string
  corpus_type_name?: string
  corpus_type_description: string
  corpus_text: string | null
  corpus_image_url: string | null
  organisation_id: number
  organisation_name: string
}

export interface ICorpusFormPost {
  import_id: string
  title: string
  description: string
  corpus_text: string | null
  corpus_image_url: string | null
  corpus_type_name: string
  organisation_id: number
}

export interface ICorpusFormPut {
  title: string
  description: string
  corpus_text: string | null
  corpus_image_url: string | null
  corpus_type_description: string
}
