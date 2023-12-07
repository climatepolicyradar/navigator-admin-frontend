import { TOrganisation } from './Organisation'

export interface ICollection {
  import_id: string
  title: string
  description: string
  families: string[]
  organisation: TOrganisation
}

export interface ICollectionFormPost {
  title: string
  description?: string
  organisation: TOrganisation
}
