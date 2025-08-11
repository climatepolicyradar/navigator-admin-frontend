import * as yup from 'yup'

export const organisationSchema = yup
  .object({
    display_name: yup.string().required(),
    internal_name: yup.string().required(),
    description: yup.string().required(),
    type: yup.string().required(),
    attribution_url: yup.string().nullable(),
  })
  .required()
