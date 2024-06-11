export interface IDetailedError {
  type: string
  loc: string[]
  msg: string
  url: string
}

export interface IError {
  status: number
  detail: string | IDetailedError[]
  message: string
  returnPage?: string
}

export interface IDecodedToken {
  sub: string
  email: string
  org_id: number
  is_superuser: boolean
  authorisation: {
    [key: string]: {
      is_admin: boolean
    }
  }
  exp: number
}
