export const canModify = (
  organisation: string,
  userAccess?:
    | never[]
    | {
        [key: string]: {
          is_admin: boolean
        }
      },
) => {
  if (!organisation) return true
  if (!userAccess) return false
  return organisation in userAccess
}
