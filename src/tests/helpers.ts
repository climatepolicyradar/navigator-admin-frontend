import sign from 'jwt-encode'

export const setupUser = (
  organisationName: string = 'CPR',
  email: string = 'test@climatepolicyradar.com',
  isSuperuser: boolean = true,
  isAdmin: boolean = true,
  orgId: number = 1,
) => {
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
          org_id: orgId,
        },
      },
      '',
    ),
  )
}
