import * as yup from 'yup'

export const documentSchema = yup
  .object({
    family_import_id: yup.string().required(),
    variant_name: yup
      .object({
        label: yup.string().required(),
        value: yup.string().required(),
      })
      .default(null)
      .nullable(),
    role: yup
      .object({
        label: yup.string().required(),
        value: yup.string().required(),
      })
      .when('$isRoleRequired', {
        is: true,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.notRequired(),
      }),
    type: yup
      .object({
        label: yup.string().required(),
        value: yup.string().required(),
      })
      .when('$isTypeRequired', {
        is: true,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.notRequired(),
      }),
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
