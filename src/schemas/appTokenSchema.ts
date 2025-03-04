import * as yup from 'yup'

export const appTokenSchema = yup
  .object({
    theme: yup.string().required(),
    hostname: yup.string().required(),
    expiry_years: yup.number().optional().nullable(),
    corpora_ids: yup.array().required('Corpora is required'),
  })
  .required()
