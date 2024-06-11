export const canModify = (
  organisation: string | null,
  isSuperUser: boolean,
  userAccess?:
    | never[]
    | null
    | {
        [key: string]: {
          is_admin: boolean
        }
      },
) => {
  if (isSuperUser === true) return true
  if (organisation === null) return true
  if (!userAccess || userAccess === null) return false
  return organisation in userAccess
}
