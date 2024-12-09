import * as yup from 'yup'
import {
  FieldType,
  CorpusInfo,
  CORPUS_METADATA_CONFIG,
  MetadataFieldConfig,
} from '@/interfaces/Metadata'
import { TTaxonomy } from '@/interfaces'
import { IChakraSelect, ITaxonomyField } from '@/interfaces/Config'

// Strongly typed validation schema creator
type ValidationSchema<T> = yup.Schema<T>

// Type-safe field validation function
const getFieldValidation = <T extends Record<string, unknown>>(
  fieldConfig: MetadataFieldConfig,
  fieldKey: string,
  isRequired: boolean,
  taxonomyField?: ITaxonomyField,
): ValidationSchema<T[keyof T]> => {
  let fieldValidation: ValidationSchema<T[keyof T]>

  switch (fieldConfig.type) {
    case FieldType.MULTI_SELECT:
      fieldValidation = yup.array().of(
        yup.object<IChakraSelect>({
          value: yup.string(),
          label: yup.string(),
        }),
      ) as ValidationSchema<T[keyof T]>
      break
    case FieldType.SINGLE_SELECT:
      fieldValidation = yup.string() as ValidationSchema<T[keyof T]>
      break
    case FieldType.TEXT:
      fieldValidation = yup.string() as ValidationSchema<T[keyof T]>
      break
    case FieldType.NUMBER:
      fieldValidation = yup.number() as ValidationSchema<T[keyof T]>
      break
    case FieldType.DATE:
      fieldValidation = yup.date() as ValidationSchema<T[keyof T]>
      break
    default:
      fieldValidation = yup.mixed() as ValidationSchema<T[keyof T]>
  }

  // Add required validation if needed
  if (isRequired) {
    fieldValidation = fieldValidation.required(
      `${fieldKey} is required`,
    ) as ValidationSchema<T[keyof T]>
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
      // Convert allowed_values to a type that Yup's oneOf can accept
      const allowedValues = (taxonomyField.allowed_values || []) as T[keyof T][]

      fieldValidation = fieldValidation.oneOf(
        allowedValues,
        `${fieldKey} must be one of the allowed values`,
      )
    }
  }

  return fieldValidation
}

// Strongly typed dynamic validation schema generator
export const generateDynamicValidationSchema = <T extends TTaxonomy>(
  taxonomy?: TTaxonomy,
  corpusInfo?: CorpusInfo,
): yup.ObjectSchema<T> => {
  // Early return if no taxonomy or corpus info
  if (!taxonomy || !corpusInfo) {
    return yup.object({}).required() as yup.ObjectSchema<T>
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
      const fieldValidation = getFieldValidation<T>(
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
    {} as Partial<T>,
  )

  // Create and return the final schema
  return yup.object(schemaShape).required() as yup.ObjectSchema<T>
}
