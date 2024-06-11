export const canModify = (
  organisation: string | null,
  isSuperuser: boolean,
  userAccess?:
    | never[]
    | null
    | {
        [key: string]: {
          is_admin: boolean
        }
      },
) => {
  if (isSuperuser === true) return true
  if (organisation === null) return true
  if (!userAccess || userAccess === null) return false
  return organisation in userAccess
}
