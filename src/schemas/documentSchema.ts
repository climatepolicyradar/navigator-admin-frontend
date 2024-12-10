import * as yup from 'yup'

export const documentSchema = yup
  .object({
    family_import_id: yup.string().required(),
    variant_name: yup.string().optional(),
    role: yup.string().optional(),
    type: yup.string().optional(),
    title: yup.string().required(),
    source_url: yup.string().url().optional(),
    user_language_name: yup
      .object({
        label: yup.string().required(),
        value: yup.string().required(),
      })
      .default(null)
      .nullable()
      .optional(),
  })
  .required()
