import * as yup from 'yup'

export const documentSchema = yup
  .object({
    family_import_id: yup.string().required(),
    variant_name: yup.string().nullable(),
    role: yup.string().required(),
    type: yup.string().required(),
    title: yup.string().required(),
    source_url: yup.string().url().nullable(),
    user_language_name: yup
      .object({
        label: yup.string().required(),
        value: yup.string().required(),
      })
      .default(null)
      .nullable(),
  })
  .required()
