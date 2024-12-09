import * as yup from 'yup'
import {
  FieldType,
  CorpusInfo,
  CORPUS_METADATA_CONFIG,
  MetadataFieldConfig,
  IFormMetadata,
} from '@/interfaces/Metadata'
import { IChakraSelect, TTaxonomy } from '@/interfaces'
import { ITaxonomyField } from '@/interfaces/Config'

// Type-safe field validation function
const getFieldValidation = (
  fieldConfig: MetadataFieldConfig,
  fieldKey: string,
  isRequired: boolean,
  taxonomyField?: ITaxonomyField,
): yup.Schema<IFormMetadata[string]> => {
  let fieldValidation: yup.Schema<IFormMetadata[string]>

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

  // Add allowed values validation if specified in taxonomy
  if (taxonomyField?.allowed_values && !taxonomyField.allow_any) {
    if (fieldConfig.type === FieldType.MULTI_SELECT) {
      fieldValidation = fieldValidation.test(
        'allowed-values',
        `${fieldKey} contains invalid values`,
        (value: IChakraSelect[]) => {
          if (!value) return true
          return value.every((item) =>
            taxonomyField.allowed_values?.includes(item.value),
          )
        },
      )
    } else {
      const allowedValues = taxonomyField.allowed_values || []
      fieldValidation = fieldValidation.test(
        'allowed-values',
        `${fieldKey} must be one of the allowed values`,
        (value: IChakraSelect | string) => {
          if (!value) return true
          const valueToCheck = typeof value === 'string' ? value : value.value
          return allowedValues.includes(valueToCheck)
        },
      )
    }
  }

  return fieldValidation
}

// Strongly typed dynamic validation schema generator
export const generateDynamicValidationSchema = (
  taxonomy?: TTaxonomy,
  corpusInfo?: CorpusInfo,
): yup.ObjectSchema<Partial<IFormMetadata>> => {
  // Early return if no taxonomy or corpus info
  if (!taxonomy || !corpusInfo) {
    return yup.object({}).required() as yup.ObjectSchema<Partial<IFormMetadata>>
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
    (acc, [fieldKey, fieldConfig]) => {
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
        taxonomyField,
      )

      return {
        ...acc,
        [fieldKey]: fieldValidation,
      }
    },
    {} as Partial<IFormMetadata>,
  )

  // Create and return the final schema
  return yup.object(schemaShape).required() as yup.ObjectSchema<
    Partial<IFormMetadata>
  >
}
