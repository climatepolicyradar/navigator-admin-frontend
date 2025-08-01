export interface IOrganisation {
  id: number
  internal_name: string
  display_name: string
  description: string
  type: string
  attribution_url: string
}

export interface IOrganisationFormPost {
  internal_name: string
  display_name: string
  description: string
  type: string
  attribution_url: string
}
