import {
  Controller,
  Control,
  RegisterOptions,
  FieldValues,
  Path,
} from 'react-hook-form'
import { Select as CRSelect } from 'chakra-react-select'
import { chakraStylesSelect } from '@/styles/chakra'
import { generateSelectOptions } from '@/utils/metadataUtils'
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react'
import { IChakraSelect } from '@/interfaces'

type TProps<T extends FieldValues> = {
  name: Path<T>
  label?: string
  control: Control<T>
  options: string[] | IChakraSelect[]
  isMulti?: boolean
  rules?: RegisterOptions
  isRequired?: boolean
  isClearable?: boolean
}

export const SelectField = <T extends FieldValues>({
  name,
  label,
  control,
  options,
  isMulti = false,
  rules,
  isRequired,
  isClearable,
}: TProps<T>) => {
  // Determine if options are already in IChakraSelect format
  const selectOptions = options
    ? Array.isArray(options) &&
      options.length > 0 &&
      typeof options[0] === 'object' &&
      'value' in options[0]
      ? options
      : generateSelectOptions(options as string[])
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
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <FormControl isInvalid={!!error} isRequired={isRequired}>
          {label && <FormLabel>{label}</FormLabel>}
          <CRSelect
            chakraStyles={chakraStylesSelect}
            isClearable={isClearable}
            isMulti={isMulti}
            isSearchable={true}
            options={selectOptions}
            aria-label={label}
            {...field}
          />
          {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
        </FormControl>
      )}
    />
  )
}
