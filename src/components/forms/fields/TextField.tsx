import { Controller, Control, FieldValues, Path } from 'react-hook-form'
import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'

type TProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
  type?: 'text' | 'number'
  placeholder?: string
  label?: string
  isRequired?: boolean
  showHelperText?: boolean
  isDisabled?: boolean
}

export const TextField = <T extends FieldValues>({
  name,
  control,
  type = 'text',
  placeholder,
  label,
  isRequired,
  showHelperText,
  isDisabled,
}: TProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormControl
            isInvalid={!!error}
            isRequired={isRequired}
            isReadOnly={isDisabled}
            isDisabled={isDisabled}
          >
            {label && <FormLabel>{label}</FormLabel>}
            <Input
              {...field} // This destructured object contains the value
              bg='white'
              type={type}
              placeholder={placeholder ?? `Enter ${name}`}
            />
            {showHelperText && isDisabled && (
              <FormHelperText>You cannot edit this</FormHelperText>
            )}
            {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
          </FormControl>
        )
      }}
    />
  )
}
