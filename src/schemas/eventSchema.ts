import * as yup from 'yup'

export const collectionSchema = yup
  .object({
    event_title: yup.string().required(),
    data: yup.string().required(),
    event_type_value: yup.string().required(),
  })
  .required()
