import React from 'react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import { Control, FieldErrors } from 'react-hook-form'
import { FieldType } from '@/types/metadata'
import { formatFieldLabel } from '@/utils/metadataUtils'
import { SelectField } from './fields/SelectField'
import { TextField } from './fields/TextField'

// Interface for rendering dynamic metadata fields
export interface DynamicMetadataFieldProps<T extends Record<string, any>> {
  fieldKey: string
  taxonomyField: {
    allowed_values?: string[]
    allow_any?: boolean
    allow_blanks?: boolean
  }
  control: Control<T>
  errors: FieldErrors<T>
  fieldType: FieldType
  validationFields?: string[]
}

export const DynamicMetadataFields = <T extends Record<string, any>>({
  fieldKey,
  taxonomyField,
  control,
  errors,
  fieldType,
  validationFields = [],
}: DynamicMetadataFieldProps<T>): React.ReactElement => {
  const {
    allowed_values = [],
    allow_any = false,
    allow_blanks = true,
  } = taxonomyField

  const renderField = () => {
    if (allow_any) {
      return <TextField<T> name={fieldKey} control={control} />
    }

    switch (fieldType) {
      case FieldType.MULTI_SELECT:
      case FieldType.SINGLE_SELECT:
        return (
          <SelectField<T>
            name={fieldKey}
            control={control}
            options={allowed_values}
            isMulti={fieldType === FieldType.MULTI_SELECT}
          />
        )
      case FieldType.NUMBER:
        return <TextField<T> name={fieldKey} control={control} type='number' />
      case FieldType.TEXT:
      default:
        return <TextField<T> name={fieldKey} control={control} />
    }
  }

  return (
    <FormControl
      isInvalid={!!errors[fieldKey]}
      mb={4}
      isRequired={validationFields.includes(fieldKey) && !allow_blanks}
    >
      <FormLabel>{formatFieldLabel(fieldKey)}</FormLabel>
      {fieldType === FieldType.MULTI_SELECT && (
        <FormHelperText mb={2}>
          You are able to search and can select multiple options
        </FormHelperText>
      )}
      {renderField()}
      <FormErrorMessage>
        {errors[fieldKey] && `${fieldKey} is required`}
      </FormErrorMessage>
    </FormControl>
  )
}
