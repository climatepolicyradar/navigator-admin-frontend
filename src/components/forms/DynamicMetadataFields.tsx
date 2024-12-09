import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import { Control, FieldErrors, FieldValues } from 'react-hook-form'
import { FieldType } from '@/interfaces/Metadata'
import { formatFieldLabel } from '@/utils/metadataUtils'
import { SelectField } from './fields/SelectField'
import { TextField } from './fields/TextField'

type TProps<T extends FieldValues> = {
  fieldKey: string
  taxonomyField: {
    allowed_values?: string[]
    allow_any?: boolean
    allow_blanks?: boolean
  }
  control: Control<T>
  errors: FieldErrors<T>
  fieldType: FieldType
}

export const DynamicMetadataFields = <T extends FieldValues>({
  fieldKey,
  taxonomyField,
  control,
  errors,
  fieldType,
}: TProps<T>) => {
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

  // Explicitly log the requirement logic
  const isRequired = !allow_blanks

  return (
    <FormControl isInvalid={!!errors[fieldKey]} mb={4} isRequired={isRequired}>
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
