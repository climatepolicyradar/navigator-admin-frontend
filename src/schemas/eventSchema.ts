import * as yup from 'yup'

export const eventSchema = yup
  .object({
    event_title: yup.string().required(),
    date: yup.string().required(),
    event_type_value: yup.string().required(),
  })
  .required()
