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
  type,
  label,
  isRequired,
  showHelperText,
  isDisabled,
}: TProps<T>) => {
  const [inputValue, setInputValue] = useState('')
  const [values, setValues] = useState<string[]>([])

  const handleAddValue = () => {
    if (inputValue.trim() && !values.includes(inputValue.trim())) {
      setValues([...values, inputValue.trim()])
      setInputValue('')
    }
  }

  const handleRemoveValue = (valueToRemove: string) => {
    setValues(values.filter((value) => value !== valueToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddValue()
    }
  }

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
            <FormHelperText mb={2}>
              You are able to add multiple values
            </FormHelperText>
            <Box>
              <VStack spacing={4} align='stretch'>
                <HStack>
                  <Input
                    {...field} // This destructured object contains the value
                    name='author'
                    type={type}
                    bg='white'
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Type a value and press Enter'
                    value={inputValue}
                  />
                </HStack>
                <HStack wrap='wrap' spacing={2}>
                  {values.map((value, index) => (
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
