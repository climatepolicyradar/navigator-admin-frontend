import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
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
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Button,
  ButtonGroup,
  useToast,
  FormHelperText,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../feedback/ApiError'
import useConfig from '@/hooks/useConfig'

interface ICollectionForm {
  title: string
  description?: string
}

type TProps = {
  collection?: ICollection
}

export const CollectionForm = ({ collection: loadedCollection }: TProps) => {
  const navigate = useNavigate()
  const toast = useToast()
  const [formError, setFormError] = useState<IError | null | undefined>()
  const { config } = useConfig()
  const organisation = config?.corpora[0].organisation
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(collectionSchema),
  })

  const handleFormSubmission = async (collection: ICollectionForm) => {
    setFormError(null)

    const collectionData: ICollectionFormPost = {
      title: collection.title,
      description: collection.description,
      organisation: loadedCollection
        ? loadedCollection.organisation
        : (organisation?.name as TOrganisation),
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
      })
    }
  }, [loadedCollection, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap='4' mb={12} align={'stretch'}>
        {formError && <ApiError error={formError} />}
        {loadedCollection && (
          <FormControl isRequired isReadOnly isDisabled>
            <FormLabel>Import ID</FormLabel>
            <Input bg='white' value={loadedCollection?.import_id} />
            <FormHelperText>You cannot edit this</FormHelperText>
          </FormControl>
        )}
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input bg='white' {...register('title')} />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea height={'300px'} bg='white' {...register('description')} />
        </FormControl>
        <ButtonGroup>
          <Button
            type='submit'
            colorScheme='blue'
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
