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
import { useNavigate } from 'react-router-dom'

interface ICollectionForm {
  title: string
  description: string
  organisation: string
}

type TProps = {
  collection?: ICollection
}

export const CollectionForm = ({ collection: loadedCollection }: TProps) => {
  const navigate = useNavigate()
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
      title: collection.title,
      description: collection.description,
      organisation: collection.organisation as TOrganisation,
    }

    if (loadedCollection) {
      return await updateCollection(collectionData, loadedCollection.import_id)
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
      .then((data) => {
        toast.closeAll()
        toast({
          title: 'Collection has been successfully created',
          status: 'success',
          position: 'top',
        })
        navigate(`/collection/${data.response}/edit`, { replace: true })
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
        {loadedCollection && (
          <FormControl isRequired isReadOnly isDisabled>
            <FormLabel>Import ID</FormLabel>
            <Input bg="white" value={loadedCollection?.import_id} />
            <FormHelperText>You cannot edit this</FormHelperText>
          </FormControl>
        )}
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
