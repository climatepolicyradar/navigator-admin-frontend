import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import { Control, FieldErrors, FieldValues, Path } from 'react-hook-form'
import { FieldType } from '@/interfaces/Metadata'
import { formatFieldLabel } from '@/utils/metadataUtils'
import { SelectField } from './fields/SelectField'
import { TextField } from './fields/TextField'
import { ITaxonomyField, TSubTaxonomy } from '@/interfaces'

type TProps<T extends FieldValues> = {
  fieldKey: string
  taxonomyField: ITaxonomyField | TSubTaxonomy
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
  // Wrong typing escape hatch -- TODO extend for sub-taxonomies
  if (typeof taxonomyField.allowed_values === 'undefined') {
    return null
  }

  const {
    allowed_values = [],
    allow_any = false,
    allow_blanks = true,
  } = taxonomyField as ITaxonomyField

  const renderField = () => {
    if (allow_any) {
      return <TextField<T> name={fieldKey as Path<T>} control={control} />
    }

    switch (fieldType) {
      case FieldType.MULTI_SELECT:
      case FieldType.SINGLE_SELECT:
        return (
          <SelectField<T>
            name={fieldKey as Path<T>}
            control={control}
            options={allowed_values}
            isMulti={fieldType === FieldType.MULTI_SELECT}
          />
        )
      case FieldType.NUMBER:
        return (
          <TextField<T>
            name={fieldKey as Path<T>}
            control={control}
            type='number'
          />
        )
      case FieldType.TEXT:
      default:
        return <TextField<T> name={fieldKey as Path<T>} control={control} />
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
