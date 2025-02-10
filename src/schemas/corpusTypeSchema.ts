import * as yup from 'yup'

export const corpusTypeSchema = yup
  .object({
    name: yup.string().required(),
    description: yup.string().required(),
  })
  .required()
