import { IConfigCorpus } from '@/interfaces'
import * as yup from 'yup'

// Base schema for core family fields
export const baseFamilySchema = yup
  .object({
    title: yup.string().required('Title is required'),
    summary: yup.string().required('Summary is required'),
    geography: yup.string().required('Geography is required'),
    category: yup.string().required('Category is required'),
    corpus: yup.object({
      label: yup.string().required('Corpus label is required'),
      value: yup.string().required('Corpus value is required'),
    }),
    collections: yup.array().optional(),
  })
  .required()

// Function to merge base schema with dynamic metadata schema
export const createFamilySchema = (metadataSchema: yup.ObjectSchema<any>) => {
  return baseFamilySchema.concat(metadataSchema)
}
