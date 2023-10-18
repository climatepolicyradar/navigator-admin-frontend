import { useEffect, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  ICollection,
  ICollectionFormPost,
  IError,
  TOrganisation,
} from '@/interfaces'
import { collectionSchema } from '@/schemas/collectionSchema'
import { createCollection, updateCollection } from '@/api/Collections'

import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Textarea,
  VStack,
  Text,
  Button,
  ButtonGroup,
  FormErrorMessage,
  useToast,
  FormHelperText,
} from '@chakra-ui/react'

interface ICollectionForm {
  import_id: string
  title: string
  description: string
  organisation: string
}

type TProps = {
  collection?: ICollection
}

export const CollectionForm = ({ collection: loadedCollection }: TProps) => {
  const toast = useToast()
  const [formError, setFormError] = useState<IError | null | undefined>()
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(collectionSchema),
  })

  const handleFormSubmission = async (collection: ICollectionForm) => {
    setFormError(null)

    const collectionData: ICollectionFormPost = {
      import_id: collection.import_id,
      title: collection.title,
      description: collection.description,
      organisation: collection.organisation as TOrganisation,
    }

    if (loadedCollection) {
      return await updateCollection(collectionData)
        .then(() => {
          toast.closeAll()
          toast({
            title: 'Collection has been successfully updated',
            status: 'success',
            position: 'top',
          })
        })
        .catch((error: IError) => {
          setFormError(error)
          toast({
            title: 'Collection has not been updated',
            description: error.message,
            status: 'error',
            position: 'top',
          })
        })
    }

    return await createCollection(collectionData)
      .then(() => {
        toast.closeAll()
        toast({
          title: 'Collection has been successfully created',
          status: 'success',
          position: 'top',
        })
      })
      .catch((error: IError) => {
        setFormError(error)
        toast({
          title: 'Collection has not been created',
          description: error.message,
          status: 'error',
          position: 'top',
        })
      })
  } // end handleFormSubmission

  const onSubmit: SubmitHandler<ICollectionForm> = (data) =>
    handleFormSubmission(data)

  useEffect(() => {
    if (loadedCollection) {
      reset({
        import_id: loadedCollection.import_id,
        title: loadedCollection.title,
        description: loadedCollection.description,
        organisation: loadedCollection.organisation,
      })
    }
  }, [loadedCollection, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap="4" mb={12} align={'stretch'}>
        {formError && (
          <Box>
            <Text color={'red.500'}>{formError.message}</Text>
            <Text fontSize="xs" color={'gray.500'}>
              {formError.detail}
            </Text>
          </Box>
        )}
        <FormControl isRequired>
          <FormLabel>Import ID</FormLabel>
          <Input bg="white" {...register('import_id')} />
          <FormHelperText>
            Must be in the format of: a.b.c.d where each letter represents a
            word or number for example: abcd.collection.1234.5678
          </FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input bg="white" {...register('title')} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea height={'300px'} bg="white" {...register('description')} />
        </FormControl>
        <Controller
          control={control}
          name="organisation"
          render={({ field }) => {
            return (
              <FormControl
                isRequired
                as="fieldset"
                isInvalid={!!errors.organisation}
              >
                <FormLabel as="legend">Organisation</FormLabel>
                <RadioGroup {...field}>
                  <HStack gap={4}>
                    <Radio bg="white" value="CCLW">
                      CCLW
                    </Radio>
                    <Radio bg="white" value="UNFCCC">
                      UNFCCC
                    </Radio>
                  </HStack>
                </RadioGroup>
                <FormErrorMessage>
                  Please select an organisation
                </FormErrorMessage>
              </FormControl>
            )
          }}
        />
        <ButtonGroup>
          <Button
            type="submit"
            colorScheme="blue"
            onSubmit={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {(loadedCollection ? 'Update ' : 'Create new ') + ' Collection'}
          </Button>
        </ButtonGroup>
      </VStack>
    </form>
  )
}
