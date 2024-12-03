import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  RadioGroup,
  Radio,
  HStack,
} from '@chakra-ui/react'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import { Select as CRSelect } from 'chakra-react-select'

// Utility function to generate select options
export const generateOptions = (values: string[]) =>
  values.map((value) => ({ value, label: value }))

// Configuration type for corpus metadata
export type CorpusMetadataConfig = {
  [corpusType: string]: {
    renderFields: string[]
    validationFields: string[]
  }
}

// Centralised configuration for corpus metadata
export const CORPUS_METADATA_CONFIG: CorpusMetadataConfig = {
  'Intl. agreements': {
    renderFields: ['author', 'author_type'],
    validationFields: ['author', 'author_type'],
  },
  'Laws and Policies': {
    renderFields: [
      'topic',
      'hazard',
      'sector',
      'keyword',
      'framework',
      'instrument',
    ],
    validationFields: [
      'topic',
      'hazard',
      'sector',
      'keyword',
      'framework',
      'instrument',
    ],
  },
  // Easy to extend for new corpus types
  default: {
    renderFields: [],
    validationFields: [],
  },
}

// Interface for rendering dynamic metadata fields
interface DynamicMetadataFieldProps {
  fieldKey: string
  taxonomyField: {
    allowed_values?: string[]
    allow_any?: boolean
    allow_blanks?: boolean
  }
  control: Control<any>
  errors: FieldErrors
  chakraStylesSelect?: any
  corpusType?: string
}

// Render a dynamic metadata field based on taxonomy configuration
export const renderDynamicMetadataField = ({
  fieldKey,
  taxonomyField,
  control,
  errors,
  chakraStylesSelect,
  corpusType,
}: DynamicMetadataFieldProps) => {
  const allowedValues = taxonomyField.allowed_values || []
  const isAllowAny = taxonomyField.allow_any
  const isAllowBlanks = taxonomyField.allow_blanks

  // Render free text input if allow_any is true
  if (isAllowAny) {
    return (
      <FormControl key={fieldKey} isInvalid={!!errors[fieldKey]}>
        <FormLabel>
          {fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)}
        </FormLabel>
        <Controller
          control={control}
          name={fieldKey}
          render={({ field }) => (
            <Input {...field} bg='white' aria-label={fieldKey} type='text' />
          )}
        />
        {errors[fieldKey] && (
          <FormErrorMessage>
            {errors[fieldKey]?.message as string}
          </FormErrorMessage>
        )}
      </FormControl>
    )
  }

  // Special handling for author_type (radio group)
  if (fieldKey === 'author_type') {
    return (
      <FormControl
        key={fieldKey}
        isRequired={!isAllowBlanks}
        as='fieldset'
        isInvalid={!!errors[fieldKey]}
      >
        <FormLabel as='legend'>Author Type</FormLabel>
        <Controller
          control={control}
          name={fieldKey}
          render={({ field }) => (
            <RadioGroup {...field}>
              <HStack gap={4}>
                {allowedValues.map((value) => (
                  <Radio bg='white' value={value} key={value}>
                    {value}
                  </Radio>
                ))}
              </HStack>
            </RadioGroup>
          )}
        />
        {errors[fieldKey] && (
          <FormErrorMessage>Please select an author type</FormErrorMessage>
        )}
      </FormControl>
    )
  }

  // Render select box if allowed_values is not empty
  if (allowedValues.length > 0) {
    return (
      <FormControl key={fieldKey} isInvalid={!!errors[fieldKey]}>
        <FormLabel>
          {fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)}
        </FormLabel>
        <Controller
          control={control}
          name={fieldKey}
          render={({ field }) => (
            <CRSelect
              chakraStyles={chakraStylesSelect}
              isClearable={false}
              isMulti={fieldKey !== 'author' && fieldKey !== 'author_type'}
              isSearchable={true}
              options={generateOptions(allowedValues)}
              {...field}
            />
          )}
        />
        {errors[fieldKey] && (
          <FormErrorMessage>
            {errors[fieldKey]?.message as string}
          </FormErrorMessage>
        )}
        {fieldKey !== 'author' && (
          <FormHelperText>
            You can search and select multiple options
          </FormHelperText>
        )}
      </FormControl>
    )
  }

  // Fallback to default text input if no specific rendering rules apply
  return (
    <FormControl key={fieldKey} isInvalid={!!errors[fieldKey]}>
      <FormLabel>
        {fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)}
      </FormLabel>
      <Controller
        control={control}
        name={fieldKey}
        render={({ field }) => (
          <Input {...field} placeholder={`Enter ${fieldKey}`} type='text' />
        )}
      />
      {errors[fieldKey] && (
        <FormErrorMessage>
          {errors[fieldKey]?.message as string}
        </FormErrorMessage>
      )}
    </FormControl>
  )
}
