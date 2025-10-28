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
        label: yup.string().when('$isRoleRequired', {
          is: true,
          then: (schema) => schema.required('Role.label is a required field'),
          otherwise: (schema) => schema.notRequired(),
        }),
        value: yup.string().when('$isRoleRequired', {
          is: true,
          then: (schema) => schema.required('Role.value is a required field'),
          otherwise: (schema) => schema.notRequired(),
        }),
      })
      .nullable()
      .when('$isRoleRequired', {
        is: true,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.notRequired(),
      }),
    type: yup
      .array()
      .of(
        yup.object({
          label: yup.string().when('$isTypeRequired', {
            is: true,
            then: (schema) => schema.required('Type.label is a required field'),
            otherwise: (schema) => schema.notRequired(),
          }),
          value: yup.string().when('$isTypeRequired', {
            is: true,
            then: (schema) => schema.required('Type.value is a required field'),
            otherwise: (schema) => schema.notRequired(),
          }),
        }),
      )
      .nullable()
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
