import { FormControl, FormErrorMessage } from '@chakra-ui/react'
import { Control, FieldErrors, FieldValues, Path } from 'react-hook-form'
import { FieldType } from '@/interfaces/Metadata'
import { formatFieldLabel } from '@/utils/metadataUtils'
import { SelectField } from './fields/SelectField'
import { TextField } from './fields/TextField'
import { ITaxonomyField, TSubTaxonomy } from '@/interfaces'
import { MultiValueInput } from './fields/MultiValueInput'

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

  // Explicitly log the requirement logic
  const isRequired = !allow_blanks

  const renderField = () => {
    if (allow_any) {
      return (
        <TextField<T>
          name={fieldKey as Path<T>}
          control={control}
          isRequired={isRequired}
          label={formatFieldLabel(fieldKey)}
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
            label={formatFieldLabel(fieldKey)}
          />
        )
      case FieldType.NUMBER:
        return (
          <TextField<T>
            name={fieldKey as Path<T>}
            control={control}
            type='number'
            isRequired={isRequired}
            label={formatFieldLabel(fieldKey)}
          />
        )
      case FieldType.TAG_INPUT:
        return (
          <MultiValueInput
            name='testAuthor'
            control={control}
            label='Test author'
          />
        )
      case FieldType.TEXT:
      default:
        return (
          <TextField<T>
            name={fieldKey as Path<T>}
            control={control}
            isRequired={isRequired}
            label={formatFieldLabel(fieldKey)}
          />
        )
    }
  }

  return (
    <FormControl isInvalid={!!errors[fieldKey]} mb={4} isRequired={isRequired}>
      {renderField()}
      <FormErrorMessage>
        {errors[fieldKey] && `${fieldKey} is required`}
      </FormErrorMessage>
    </FormControl>
  )
}
