import React from 'react'
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  RadioGroup,
  Radio,
  HStack,
} from '@chakra-ui/react'
import { IChakraSelect } from '@/interfaces'

interface RadioGroupFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
  options: IChakraSelect[]
  rules?: RegisterOptions
}

export const RadioGroupField = <T extends FieldValues>({
  name,
  label,
  control,
  options,
  rules,
}: RadioGroupFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <FormControl isRequired={!!rules?.required} isInvalid={!!error}>
          <FormLabel as='legend'>{label}</FormLabel>
          <RadioGroup {...field}>
            <HStack gap={4}>
              {options.map((option) => (
                <Radio key={option.value} bg='white' value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </HStack>
          </RadioGroup>
          {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
        </FormControl>
      )}
    />
  )
}
