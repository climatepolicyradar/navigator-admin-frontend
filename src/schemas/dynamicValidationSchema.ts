import * as yup from 'yup'

// Configuration type for corpus metadata
export type CorpusMetadataConfig = {
  [corpusType: string]: {
    renderFields: string[]
    validationFields: string[]
  }
}

// Centralised configuration for corpus metadata
export const CORPUS_METADATA_CONFIG: CorpusMetadataConfig = {
  'Intl. agreements': {
    renderFields: ['author', 'author_type'],
    validationFields: ['author', 'author_type'],
  },
  'Laws and Policies': {
    renderFields: [
      'topic',
      'hazard',
      'sector',
      'keyword',
      'framework',
      'instrument',
    ],
    validationFields: [
      'topic',
      'hazard',
      'sector',
      'keyword',
      'framework',
      'instrument',
    ],
  },
  // Easy to extend for new corpus types
  default: {
    renderFields: [],
    validationFields: [],
  },
}

// Validation schema generation utility
export const generateDynamicValidationSchema = (
  taxonomy: any,
  corpusInfo: any,
  schema: any,
) => {
  if (!taxonomy) return schema

  // Get validation fields based on corpus type, fallback to default
  const { validationFields } =
    CORPUS_METADATA_CONFIG[corpusInfo?.corpus_type] ||
    CORPUS_METADATA_CONFIG['default']

  const metadataValidation = validationFields.reduce((acc, fieldKey) => {
    const taxonomyField = taxonomy[fieldKey as keyof typeof taxonomy]

    if (taxonomyField) {
      // Get allowed values for the current field
      const allowedValues = taxonomyField.allowed_values || []

      // If allow_any is true, use a simple string validation
      if (taxonomyField.allow_any) {
        acc[fieldKey] = yup.string()
      }
      // For multi-select fields with allowed values
      else if (
        allowedValues.length > 0 &&
        fieldKey !== 'author' &&
        fieldKey !== 'author_type'
      ) {
        acc[fieldKey] = yup.array().of(yup.string())
      }
      // For single select or text fields
      else {
        // Use allow_blanks to determine if the field is required
        acc[fieldKey] = taxonomyField.allow_blanks
          ? yup.string()
          : yup.string().required(`${fieldKey} is required`)
      }
    }

    return acc
  }, {} as any)

  return schema.shape({
    ...metadataValidation,
  })
}
