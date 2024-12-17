export interface ICollection {
  import_id: string
  title: string
  description: string
  families: string[]
  organisation: string
}

export interface ICollectionFormPost {
  title: string
  description?: string
  organisation?: string
}
