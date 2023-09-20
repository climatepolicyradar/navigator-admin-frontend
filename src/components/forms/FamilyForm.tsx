import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import {
  Box,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  HStack,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Tag,
  Textarea,
  VStack,
  Text,
  TagCloseButton,
  TagLabel,
  Stack,
  Badge,
  Tooltip,
  Button,
  ButtonGroup,
  FormErrorMessage,
} from '@chakra-ui/react'
import { FormEvent } from 'react'

interface IFormInputs {
  category: string
  collections: string[]
  documents: string[]
  events: string[]
  geography: string
  import_id: string
  // last_updated_date: string -- readonly
  metadata: {
    framework: string[]
    hazard: string[]
    instrument: string[]
    keyword: string[]
    sector: string[]
    topic: string[]
  }
  organisation: string
  published_date: string
  slug: string
  status: string
  summary: string
  title: string
}

interface IFamilyFormTEMP {
  import_id: string
  title: string
  summary: string
  geography: string
  category: string
  // metadata: string
  organisation: string
}

const schema = yup
  .object({
    import_id: yup.string().required(),
    title: yup.string().required(),
    summary: yup.string().required(),
    geography: yup.string().required(),
    category: yup.string().required(),
    organisation: yup.string().required(),
  })
  .required()

export const FamilyForm = () => {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isDirty,
      dirtyFields,
      touchedFields,
      isValid,
      isSubmitting,
    },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit: SubmitHandler<IFamilyFormTEMP> = (data) => console.log(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap="4" mb={4}>
        <FormControl isRequired>
          <FormLabel>Import ID</FormLabel>
          <Input bg="white" {...register('import_id')} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input bg="white" {...register('title')} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Summary</FormLabel>
          <Textarea height={'300px'} bg="white" {...register('summary')} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Geography</FormLabel>
          <Select background="white" {...register('geography')}>
            <option value="">Please select</option>
            <option value="international">International</option>
            <option value="geo">United Kingdom</option>
            <option value="usa">United States of America</option>
            <option value="canada">Canada</option>
            <option value="mexico">Mexico</option>
            <option value="brazil">Brazil</option>
            <option value="argentina">Argentina</option>
          </Select>
        </FormControl>
        <FormControl isRequired as="fieldset" isInvalid={!!errors.category}>
          <FormLabel as="legend">Category</FormLabel>
          <RadioGroup>
            <HStack gap={4}>
              <Radio bg="white" value="Executive" {...register('category')}>
                Executive
              </Radio>
              <Radio bg="white" value="Legislative" {...register('category')}>
                Legislative
              </Radio>
              <Radio bg="white" value="Litigation" {...register('category')}>
                Litigation
              </Radio>
              <Radio bg="white" value="UNFCCC" {...register('category')}>
                UNFCCC
              </Radio>
            </HStack>
          </RadioGroup>
          <FormErrorMessage>Please select a category</FormErrorMessage>
        </FormControl>
        <FormControl isRequired as="fieldset" isInvalid={!!errors.organisation}>
          <FormLabel>Organisation</FormLabel>
          <RadioGroup>
            <HStack gap={4}>
              <Radio bg="white" value="CCLW" {...register('organisation')}>
                CCLW
              </Radio>
              <Radio bg="white" value="UNFCCC" {...register('organisation')}>
                UNFCCC
              </Radio>
            </HStack>
          </RadioGroup>
          <FormErrorMessage>Please select an organisation</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Collection</FormLabel>
          <Select background="white">
            <option value="">Please select</option>
            <option value="CCLW.collection.1687.0">CO2 Act</option>
          </Select>
        </FormControl>
      </VStack>

      <ButtonGroup>
        <Button
          type="submit"
          colorScheme="blue"
          onSubmit={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          Create new Family
        </Button>
      </ButtonGroup>
    </form>
  )
}
