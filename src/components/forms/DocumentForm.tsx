import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { IDocument, IDocumentFormPost, IError } from '@/interfaces'
import { createDocument, updateDocument } from '@/api/Documents'
import { documentSchema } from '@/schemas/documentSchema'

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Button,
  ButtonGroup,
  useToast,
  FormHelperText,
} from '@chakra-ui/react'

type TProps = {
  document?: IDocument
  familyId?: string
  onSuccess?: (documentId: string) => void
}

export const DocumentForm = ({
  document: loadedDocument,
  familyId,
  onSuccess,
}: TProps) => {
  const toast = useToast()
  const [formError, setFormError] = useState<IError | null | undefined>()
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(documentSchema),
  })

  const handleFormSubmission = async (documentData: IDocumentFormPost) => {
    setFormError(null)

    if (loadedDocument) {
      return await updateDocument(documentData)
        .then((data) => {
          toast.closeAll()
          toast({
            title: 'Document has been successfully updated',
            status: 'success',
            position: 'top',
          })
          onSuccess && onSuccess(data.response.import_id)
        })
        .catch((error: IError) => {
          setFormError(error)
          toast({
            title: 'Document has not been updated',
            description: error.message,
            status: 'error',
            position: 'top',
          })
        })
    }

    return await createDocument(documentData)
      .then((data) => {
        toast.closeAll()
        toast({
          title: 'Collection has been successfully created',
          status: 'success',
          position: 'top',
        })
        onSuccess && onSuccess(data.response.import_id)
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

  const onSubmit: SubmitHandler<IDocumentFormPost> = (data) =>
    handleFormSubmission(data)

  const invalidDocumentCreation = !loadedDocument && !familyId

  useEffect(() => {
    if (loadedDocument) {
      reset({
        family_import_id: loadedDocument.family_import_id,
        variant_name: loadedDocument.variant_name ?? '',
        role: loadedDocument.role ?? '',
        type: loadedDocument.type ?? '',
        title: loadedDocument.title,
        source_url: loadedDocument.source_url ?? '',
        user_language_name: loadedDocument.user_language_name ?? '',
      })
    }
  }, [loadedDocument, reset])

  useEffect(() => {
    if (familyId) {
      reset({
        family_import_id: familyId,
      })
    }
  }, [familyId, reset])

  return (
    <>
      {invalidDocumentCreation && (
        <Box>
          <Text color={'red.500'}>Invalid Document creation</Text>
          <Text fontSize="xs" color={'gray.500'}>
            A document must be linked to a family, please select a family
          </Text>
        </Box>
      )}
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
          <FormControl isRequired isReadOnly isDisabled>
            <FormLabel>Family ID</FormLabel>
            <Input bg="white" {...register('family_import_id')} />
            <FormHelperText>This field is not editable</FormHelperText>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input bg="white" {...register('title')} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Source URL</FormLabel>
            <Input bg="white" {...register('source_url')} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Role</FormLabel>
            <Input bg="white" {...register('role')} />
          </FormControl>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <Input bg="white" {...register('type')} />
          </FormControl>
          <FormControl>
            <FormLabel>Variant</FormLabel>
            <Input bg="white" {...register('variant_name')} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Language</FormLabel>
            <Input bg="white" {...register('user_language_name')} />
          </FormControl>
          <ButtonGroup>
            <Button
              type="submit"
              colorScheme="blue"
              onSubmit={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {(loadedDocument ? 'Update ' : 'Create new ') + ' Docuement'}
            </Button>
          </ButtonGroup>
        </VStack>
      </form>
    </>
  )
}
