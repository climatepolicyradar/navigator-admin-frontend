import * as yup from 'yup'
import {
  FieldType,
  Taxonomy,
  CorpusInfo,
  CORPUS_METADATA_CONFIG,
} from '@/interfaces/Metadata'

export const generateDynamicValidationSchema = <
  T extends Record<string, unknown>,
>(
  taxonomy: Taxonomy | null,
  corpusInfo: CorpusInfo | null,
): yup.ObjectSchema<T> => {
  if (!taxonomy || !corpusInfo) {
    return yup.object({}).required()
  }

  const metadataFields =
    CORPUS_METADATA_CONFIG[corpusInfo.corpus_type]?.renderFields || {}
  const validationFields =
    CORPUS_METADATA_CONFIG[corpusInfo.corpus_type]?.validationFields || []

  const schemaShape = Object.entries(metadataFields).reduce(
    (acc, [fieldKey, fieldConfig]) => {
      // Get the field's taxonomy configuration
      const taxonomyField = taxonomy[fieldKey]
      const isRequired =
        validationFields.includes(fieldKey) &&
        (!taxonomyField || taxonomyField.allow_blanks === false)

      // Generate field validation based on field type and requirements
      let fieldValidation: yup.Schema
      switch (fieldConfig.type) {
        case FieldType.MULTI_SELECT:
          fieldValidation = yup.array().of(
            yup.object({
              value: yup.string(),
              label: yup.string(),
            }),
          )
          break
        case FieldType.SINGLE_SELECT:
          fieldValidation = yup.string()
          break
        case FieldType.TEXT:
          fieldValidation = yup.string()
          break
        case FieldType.NUMBER:
          fieldValidation = yup.number()
          break
        case FieldType.DATE:
          fieldValidation = yup.date()
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
            (value) => {
              if (!value) return true
              return value.every((item: any) =>
                taxonomyField.allowed_values?.includes(item.value),
              )
            },
          )
        } else {
          fieldValidation = fieldValidation.oneOf(
            taxonomyField.allowed_values,
            `${fieldKey} must be one of the allowed values`,
          )
        }
      }

      return {
        ...acc,
        [fieldKey]: fieldValidation,
      }
    },
    {} as T,
  )

  return yup.object(schemaShape).required()
}
