import * as yup from 'yup'

export const corpusSchema = yup
  .object({
    title: yup.string().required(),
    description: yup.string().required(),
    corpus_text: yup.string().nullable(),
    corpus_image_url: yup.string().nullable(),
    corpus_type_name: yup.object({
      label: yup.string().required(),
      value: yup.string().required(),
    }),
    corpus_type_description: yup.string().required(),
    organisation_id: yup.object({
      label: yup.string().required(),
      value: yup.number().required(),
    }),
  })
  .required()
