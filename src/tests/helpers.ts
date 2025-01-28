import sign from 'jwt-encode'

interface SetupUserParams {
  organisationName?: string
  email?: string
  isSuperuser?: boolean
  isAdmin?: boolean
  orgId?: number
}

export const setupUser = ({
  organisationName = 'CCLW',
  email = 'user@navigator.com',
  isSuperuser = true,
  isAdmin = true,
  orgId = 1,
}: SetupUserParams = {}) => {
  localStorage.setItem(
    'token',
    sign(
      {
        email: email,
        is_superuser: isSuperuser,
        authorisation: {
          [organisationName]: {
            is_admin: isAdmin,
          },
        },
        org_id: orgId,
      },
      process.env.SECRET_KEY as string,
    ),
  )
}
