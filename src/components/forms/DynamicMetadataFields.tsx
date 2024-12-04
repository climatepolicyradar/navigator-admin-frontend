import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  RadioGroup,
  Radio,
  HStack,
} from '@chakra-ui/react'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import { Select as CRSelect } from 'chakra-react-select'
import * as yup from 'yup'
import {
  generateDynamicValidationSchema,
  CORPUS_METADATA_CONFIG,
  CorpusMetadataConfig,
  FieldType,
} from '@/schemas/dynamicValidationSchema'
import React from 'react'
import { chakraStylesSelect } from '@/styles/chakra'

// Utility function to generate select options
export const generateOptions = (values: string[]) =>
  values.map((value) => ({ value, label: value }))

// Utility function to format field labels
const formatFieldLabel = (key: string): string => {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Interface for rendering dynamic metadata fields
interface DynamicMetadataFieldProps {
  fieldKey: string
  taxonomyField: {
    allowed_values?: string[]
    allow_any?: boolean
    allow_blanks?: boolean
  }
  control: Control<any>
  errors: FieldErrors<any>
  fieldType: FieldType
}

export const DynamicMetadataField: React.FC<DynamicMetadataFieldProps> =
  React.memo(({ fieldKey, taxonomyField, control, errors, fieldType }) => {
    const allowedValues = taxonomyField.allowed_values || []
    const isAllowAny = taxonomyField.allow_any
    const isAllowBlanks = taxonomyField.allow_blanks

    const renderFieldByType = () => {
      if (isAllowAny) {
        return renderTextField()
      }

      switch (fieldType) {
        case FieldType.MULTI_SELECT:
        case FieldType.SINGLE_SELECT:
          return renderSelectField()
        case FieldType.TEXT:
          return renderTextField()
        case FieldType.NUMBER:
          return renderNumberField()
        default:
          return renderTextField()
      }
    }

    const renderSelectField = () => (
      <Controller
        name={fieldKey}
        control={control}
        render={({ field }) => (
          <CRSelect
            chakraStyles={chakraStylesSelect}
            isClearable={false}
            isMulti={fieldType === FieldType.MULTI_SELECT}
            isSearchable={true}
            options={generateOptions(allowedValues)}
            {...field}
          />
        )}
      />
    )

    const renderTextField = () => (
      <Controller
        name={fieldKey}
        control={control}
        render={({ field }) => (
          <Input {...field} bg='white' placeholder={`Enter ${fieldKey}`} />
        )}
      />
    )

    const renderNumberField = () => (
      <Controller
        name={fieldKey}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            bg='white'
            type='number'
            placeholder={`Enter ${fieldKey}`}
          />
        )}
      />
    )

    return (
      <FormControl isInvalid={!!errors[fieldKey]} mb={4} isRequired={!isAllowBlanks}>
        <FormLabel>{formatFieldLabel(fieldKey)}</FormLabel>
        {fieldType === FieldType.MULTI_SELECT && (
          <FormHelperText mb={2}>
            You are able to search and can select multiple options
          </FormHelperText>
        )}
        {renderFieldByType()}
        <FormErrorMessage>
          {errors[fieldKey] && `${fieldKey} is required`}
        </FormErrorMessage>
      </FormControl>
    )
  })
