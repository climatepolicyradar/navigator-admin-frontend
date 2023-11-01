export interface IError {
  status: number
  detail: string
  message: string
  returnPage?: string
}

export interface IDecodedToken {
  sub: string
  email: string
  is_superuser: boolean
  authorisation: {
    [key: string]: {
      is_admin: boolean
    }
  }
  exp: number
}
