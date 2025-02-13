import * as yup from 'yup'

export const corpusTypeSchema = yup
  .object({
    name: yup.string().required(),
    description: yup.string().required(),
    taxonomy: yup.object({
      fieldName: yup.string().required(),
      allowAny: yup.string().required(),
      allowBlanks: yup.string().required(),
      allowedValues: yup.array().of(yup.string()),
    }),
  })
  .required()
