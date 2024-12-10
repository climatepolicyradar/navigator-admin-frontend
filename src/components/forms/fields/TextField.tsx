import { Controller, Control, FieldValues, Path } from 'react-hook-form'
import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react'

type TProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
  type?: 'text' | 'number'
  placeholder?: string
  label?: string
  isRequired?: boolean
}

export const TextField = <T extends FieldValues>({
  name,
  control,
  type = 'text',
  placeholder,
  label,
  isRequired,
}: TProps<T>) => {
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
