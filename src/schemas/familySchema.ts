import { IConfigCorpus } from '@/interfaces'
import * as yup from 'yup'

export const familySchema = yup
  .object({
    title: yup.string().required(),
    summary: yup.string().required(),
    geography: yup.string().required(),
    category: yup.string().required(),
    corpus: yup.object({
      label: yup.string().required(),
      value: yup.string().required(),
    }),
    collections: yup.array().optional(),
    author: yup.string().when('corpus', {
      is: (val: IConfigCorpus) => val.label == 'UNFCCC Submissions',
      then: (schema) => schema.required(),
    }),
    author_type: yup.string().when('corpus', {
      is: (val: IConfigCorpus) => val.label == 'UNFCCC Submissions',
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
