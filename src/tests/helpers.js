import sign from 'jwt-encode'

export const setupUser = (
  organisationName = 'CPR',
  email = 'test@climatepolicyradar.com',
  isSuperuser = true,
  isAdmin = true,
  orgId = 1,
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
