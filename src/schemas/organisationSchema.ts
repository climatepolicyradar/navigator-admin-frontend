import * as yup from 'yup'

export const organisationSchema = yup
  .object({
    display_name: yup.string().when('$isNewOrg', {
      is: false,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
    }),
    internal_name: yup.string().required(),
    description: yup.string().required(),
    type: yup.string().required(),
    attribution_link: yup.string().required(),
  })
  .required()
