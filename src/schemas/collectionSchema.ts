import * as yup from 'yup'

export const collectionSchema = yup
  .object({
    title: yup.string().required(),
    description: yup.string().required(),
    organisation: yup.string().required(),
  })
  .required()
