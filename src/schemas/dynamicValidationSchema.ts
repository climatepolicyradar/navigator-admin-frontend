import * as yup from 'yup'
import {
  FieldType,
  CorpusInfo,
  CORPUS_METADATA_CONFIG,
  MetadataFieldConfig,
} from '@/interfaces/Metadata'
import { TFamilyMetadata, TTaxonomy } from '@/interfaces'

// Type-safe field validation function
const getFieldValidation = (
  fieldConfig: MetadataFieldConfig,
  fieldKey: string,
  isRequired: boolean,
) => {
  let fieldValidation

  switch (fieldConfig.type) {
    case FieldType.MULTI_SELECT:
      fieldValidation = yup.array().of(
        yup.object({
          value: yup.string().required(),
          label: yup.string().required(),
        }),
      )
      break
    case FieldType.SINGLE_SELECT:
      fieldValidation = yup.object({
        value: yup.string().required(),
        label: yup.string().required(),
      })
      break
    case FieldType.TEXT:
      fieldValidation = yup.string()
      break
    case FieldType.NUMBER:
      fieldValidation = yup.number()
      break
    default:
      fieldValidation = yup.mixed()
  }

  // Add required validation if needed
  if (isRequired) {
    fieldValidation = fieldValidation.required(`${fieldKey} is required`)
  }

  return fieldValidation
}

// Strongly typed dynamic validation schema generator
export const generateDynamicValidationSchema = (
  taxonomy?: TTaxonomy,
  corpusInfo?: CorpusInfo,
): yup.ObjectSchema<TFamilyMetadata> => {
  // Early return if no taxonomy or corpus info
  if (!taxonomy || !corpusInfo) {
    return yup.object({}).required() as yup.ObjectSchema<TFamilyMetadata>
  }

  // Get metadata fields and validation fields for the specific corpus type
  const metadataFields =
    CORPUS_METADATA_CONFIG[corpusInfo.corpus_type]?.renderFields ||
    CORPUS_METADATA_CONFIG.default.renderFields

  const validationFields =
    CORPUS_METADATA_CONFIG[corpusInfo.corpus_type]?.validationFields ||
    CORPUS_METADATA_CONFIG.default.validationFields

  // Build schema shape dynamically
  const schemaShape = Object.entries(metadataFields).reduce(
    (transformedMetadata, [fieldKey, fieldConfig]) => {
      // Get the field's taxonomy configuration
      const taxonomyField = taxonomy[fieldKey]
      const isRequired =
        validationFields.includes(fieldKey) &&
        (!taxonomyField || taxonomyField.allow_blanks === false)

      // Generate field validation
      const fieldValidation = getFieldValidation(
        fieldConfig,
        fieldKey,
        isRequired,
      )

      // Ensure fieldValidation is a Yup schema
      transformedMetadata[fieldKey] = fieldValidation

      return transformedMetadata
    },
    {} as yup.ObjectShape, // Initialise as an empty ObjectShape
  )

  // Create and return the final schema
  return yup.object(schemaShape).required() as yup.ObjectSchema<TFamilyMetadata>
}
