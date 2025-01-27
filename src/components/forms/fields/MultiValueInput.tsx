import React, { useState } from 'react'
import {
  Box,
  Input,
  Tag,
  TagLabel,
  TagCloseButton,
  VStack,
  HStack,
  FormLabel,
  FormControl,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react'
import { Controller, Control, FieldValues, Path } from 'react-hook-form'

type TProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
  type?: 'text' | 'number'
  label?: string
  isRequired?: boolean
  showHelperText?: boolean
  isDisabled?: boolean
}

export const MultiValueInput = <T extends FieldValues>({
  name,
  control,
  type = 'text',
  label,
  showHelperText,
  isDisabled,
}: TProps<T>) => {
  const [inputValue, setInputValue] = useState('')

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const handleAddValue = () => {
          const currentValues = (field.value as string[]) || []
          if (inputValue.trim() && !currentValues.includes(inputValue.trim())) {
            const newValues = [...currentValues, inputValue.trim()]
            field.onChange(newValues)
            setInputValue('')
          }
        }

        const handleRemoveValue = (valueToRemove: string) => {
          const currentValues = field.value || []
          const newValues = currentValues.filter(
            (value) => value !== valueToRemove,
          )
          field.onChange(newValues)
        }

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleAddValue()
          }
        }

        return (
          <FormControl
            isInvalid={!!error}
            isReadOnly={isDisabled}
            isDisabled={isDisabled}
            isRequired={field.value?.length === 0}
          >
            {label && <FormLabel>{label}</FormLabel>}
            <FormHelperText mb={2}>
              You are able to add multiple values
            </FormHelperText>
            <Box>
              <VStack spacing={4} align='stretch'>
                <HStack>
                  <Input
                    {...field} // This destructured object contains the value
                    name={name}
                    type={type}
                    bg='white'
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Type a value and press Enter'
                    value={inputValue}
                  />
                </HStack>
                <HStack wrap='wrap' spacing={2}>
                  {(field.value || []).map((value: string, index: number) => (
                    <Tag
                      key={index}
                      size='lg'
                      colorScheme='gray'
                      borderRadius='full'
                    >
                      <TagLabel>{value}</TagLabel>
                      <TagCloseButton
                        onClick={() => handleRemoveValue(value)}
                      />
                    </Tag>
                  ))}
                </HStack>
              </VStack>
            </Box>
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
