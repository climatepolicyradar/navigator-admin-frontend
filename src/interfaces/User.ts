export interface IOrgMembership {
  id: number
  is_admin: boolean
}

export interface IUser {
  email: string
  name: string | null
  is_superuser: boolean
  organisations: IOrgMembership[]
}
