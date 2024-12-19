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

function hasAllowedValues(
  field: ITaxonomyField | TSubTaxonomy,
): field is ITaxonomyField {
  return 'allowed_values' in field
}

export const DynamicMetadataFields = <T extends FieldValues>({
  fieldKey,
  taxonomyField,
  control,
  errors,
  fieldType,
}: TProps<T>) => {
  // Wrong typing escape hatch -- TODO extend for sub-taxonomies
  if (!taxonomyField) return null
  if (!hasAllowedValues(taxonomyField)) {
    return null
  }

  const {
    allowed_values = [],
    allow_any = false,
    allow_blanks = true,
  } = taxonomyField

  const renderField = (isRequired: boolean) => {
    if (allow_any) {
      console.log(
        'Rendering the form fields, allow_any True:',
        fieldKey,
        fieldType,
        taxonomyField,
      )
      return (
        <TextField<T>
          name={fieldKey as Path<T>}
          control={control}
          isRequired={isRequired}
        />
      )
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
            isRequired={isRequired}
          />
        )
      case FieldType.NUMBER:
        return (
          <TextField<T>
            name={fieldKey as Path<T>}
            control={control}
            type='number'
            isRequired={isRequired}
          />
        )
      case FieldType.TEXT:
      default:
        return (
          <TextField<T>
            name={fieldKey as Path<T>}
            control={control}
            isRequired={isRequired}
          />
        )
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
      {renderField(isRequired)}
      <FormErrorMessage>
        {errors[fieldKey] && `${fieldKey} is required`}
      </FormErrorMessage>
    </FormControl>
  )
}
