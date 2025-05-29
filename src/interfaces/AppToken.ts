export interface IAppTokenFormPost {
  corpora_ids: string[]
  theme: string
  hostname: string
  expiry_years: number | null
}

export interface IAppToken {
  allowed_corpora_ids: string[]
  sub: string
  aud: string
  iss: string
  exp: number
  iat: number
}
