import React from 'react'
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form'
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react'
import { WYSIWYG } from '@/components/form-components/WYSIWYG'
import { FieldError } from 'react-hook-form'

interface WYSIWYGFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
  defaultValue?: string
  onChange: (html: string) => void
  error?: FieldError
  isRequired?: boolean
}

export const WYSIWYGField = <T extends FieldValues>({
  name,
  label,
  control,
  defaultValue,
  onChange,
  error,
  isRequired = false,
}: WYSIWYGFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: isRequired ? 'This field is required' : false,
        validate: (value) =>
          isRequired
            ? (value && value.trim() !== '') || 'This field is required'
            : true,
      }}
      render={({ field }) => (
        <FormControl isRequired={isRequired} isInvalid={!!error}>
          <FormLabel>{label}</FormLabel>
          <WYSIWYG
            html={defaultValue}
            onChange={(html) => {
              field.onChange(html)
              onChange(html)
            }}
          />
          {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
        </FormControl>
      )}
    />
  )
}
