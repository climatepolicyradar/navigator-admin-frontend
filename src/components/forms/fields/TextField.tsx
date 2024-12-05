import React from 'react'
import { Controller, Control } from 'react-hook-form'
import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react'

interface TextFieldProps<T extends Record<string, any>> {
  name: string
  control: Control<T>
  type?: 'text' | 'number'
  placeholder?: string
  label?: string
  isRequired?: boolean
}

export const TextField = <T extends Record<string, any>>({
  name,
  control,
  type = 'text',
  placeholder,
  label,
  isRequired,
}: TextFieldProps<T>): React.ReactElement => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl isInvalid={!!error} isRequired={isRequired}>
          {label && <FormLabel>{label}</FormLabel>}
          <Input
            {...field}
            bg='white'
            type={type}
            placeholder={placeholder ?? `Enter ${name}`}
          />
          {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
        </FormControl>
      )}
    />
  )
}
