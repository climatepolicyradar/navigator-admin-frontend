import * as yup from 'yup'
import { TFamilyMetadata } from '@/interfaces/Family'

// Base schema for core family fields (non-metadata)
export const baseFamilySchema = yup
  .object({
    title: yup.string().required('Title is required'),
    summary: yup.string().required('Summary is required'),
    geography: yup
      .object({
        label: yup.string().required(),
        value: yup.string().required(),
      })
      .required('Geography is required'),
    category: yup.string().required('Category is required'),
    corpus: yup.object({
      label: yup.string().required(),
      value: yup.string().required(),
    }).required('Corpus is required'),
    collections: yup.array().optional(),
  })
  .required()

// Function to merge base schema with dynamic metadata schema
export const createFamilySchema = (
  metadataSchema: yup.ObjectSchema<TFamilyMetadata>,
) => {
  return baseFamilySchema.concat(metadataSchema)
}
