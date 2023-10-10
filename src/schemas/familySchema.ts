import * as yup from 'yup'

export const familySchema = yup
  .object({
    import_id: yup.string().required(),
    title: yup.string().required(),
    summary: yup.string().required(),
    geography: yup.string().required(),
    category: yup.string().required(),
    organisation: yup.string().required(),
    collections: yup.array().optional(),
    author: yup.string().when('organisation', {
      is: 'UNFCCC',
      then: (schema) => schema.required(),
    }),
    author_type: yup.string().when('organisation', {
      is: 'UNFCCC',
      then: (schema) => schema.required(),
    }),
    topic: yup.array().optional(),
    hazard: yup.array().optional(),
    sector: yup.array().optional(),
    keyword: yup.array().optional(),
    framework: yup.array().optional(),
    instrument: yup.array().optional(),
  })
  .required()
