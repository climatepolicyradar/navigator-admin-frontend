import { IConfigLanguageSorted } from '.'

export interface IDocument {
  import_id: string
  family_import_id: string
  variant_name: string | null
  status: string
  slug: string
  metadata: IDocumentMetadata
  physical_id: number
  title: string
  md5_sum: string | null
  cdn_object: string | null
  source_url: string | null
  content_type: string | null
  user_language_name: string | null
  created: string
  last_modified: string
}

export interface IDocumentFormPost {
  family_import_id: string
  variant_name?: string | null
  role?: string
  type?: string
  title: string
  source_url?: string | null
  user_language_name?: IConfigLanguageSorted | null
}

export interface IDocumentFormPostModified {
  family_import_id: string
  variant_name?: string | null
  metadata: IDocumentMetadata
  title: string
  source_url?: string | null
  user_language_name?: string | null
}

export interface IDocumentMetadata {
  role: string[]
  type: string[]
}
