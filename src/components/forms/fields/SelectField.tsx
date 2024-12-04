import React from 'react'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import { Select as CRSelect } from 'chakra-react-select'
import { chakraStylesSelect } from '@/styles/chakra'
import { FieldType, SelectOption } from '@/types/metadata'
import { generateSelectOptions } from '@/utils/metadataUtils'
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react'

interface SelectFieldProps<T extends Record<string, any>> {
  name: string
  label?: string
  control: Control<T>
  options: string[] | SelectOption[]
  isMulti?: boolean
  rules?: any
  isRequired?: boolean
}

export const SelectField = <T extends Record<string, any>>({
  name,
  label,
  control,
  options,
  isMulti = false,
  rules,
  isRequired,
}: SelectFieldProps<T>): React.ReactElement => {
  // Determine if options are already in SelectOption format
  const selectOptions = options ? 
    (Array.isArray(options) && options.length > 0 && 
    typeof options[0] === 'object' && 'value' in options[0] 
    ? options 
    : generateSelectOptions(options as string[])) 
    : []

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        ...rules,
        required: isRequired ? 'This field is required' : false,
        validate: (value) => {
          if (isRequired) {
            if (isMulti) {
              return (value && value.length > 0) || 'This field is required'
            }
            return value || 'This field is required'
          }
          return true
        }
      }}
      render={({ field, fieldState: { error } }) => (
        <FormControl isInvalid={!!error} isRequired={isRequired}>
          {label && <FormLabel>{label}</FormLabel>}
          <CRSelect
            chakraStyles={chakraStylesSelect}
            isClearable={false}
            isMulti={isMulti}
            isSearchable={true}
            options={selectOptions}
            {...field}
          />
          {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
        </FormControl>
      )}
    />
  )
}
