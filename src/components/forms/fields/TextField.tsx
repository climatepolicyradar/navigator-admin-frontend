import { Controller, Control, FieldValues, Path } from 'react-hook-form'
import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react'

type TProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
  type?: 'text' | 'number'
  placeholder?: string
  label?: string | React.ReactNode
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

            <InputGroup>
              {type === 'number' && <InputLeftAddon children='$' />}
              <Input
                {...field} // This destructured object contains the value
                bg='white'
                type={type}
                placeholder={
                  placeholder ??
                  (typeof label === 'string'
                    ? `Enter ${label?.toLowerCase()}`
                    : placeholder)
                }
                value={field.value ?? ''} // this prevents the component changing from a controlled to uncontrolled component
              />
              {showHelperText && isDisabled && (
                <FormHelperText>You cannot edit this</FormHelperText>
              )}
            </InputGroup>
            {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
          </FormControl>
        )
      }}
    />
  )
}
