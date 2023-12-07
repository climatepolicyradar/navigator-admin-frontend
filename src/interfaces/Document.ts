export interface IDocument {
  import_id: string
  family_import_id: string
  variant_name: string | null
  status: string
  role: string | null
  type: string | null
  slug: string
  physical_id: number
  title: string
  md5_sum: string | null
  cdn_object: string | null
  source_url: string | null
  content_type: string | null
  user_language_name: string | null
}

export interface IDocumentFormPost {
  family_import_id: string
  variant_name?: string | null
  role: string
  type: string
  title: string
  source_url: string
  user_language_name?: string | null
}
