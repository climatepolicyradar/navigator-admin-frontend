import * as yup from 'yup'

export const collectionSchema = yup
  .object({
    import_id: yup.string().required(),
    title: yup.string().required(),
    description: yup.string().required(),
    organisation: yup.string().required(),
  })
  .required()
