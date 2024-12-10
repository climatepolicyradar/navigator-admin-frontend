import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  BACK_TO_FAMILIES_ERROR_DETAIL,
  NO_TAXONOMY_ERROR,
} from '@/constants/errors'
import {
  IDocument,
  IDocumentFormPost,
  IDocumentFormPostModified,
  IDocumentMetadata,
  IError,
  TTaxonomy,
} from '@/interfaces'
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
  FormErrorMessage,
} from '@chakra-ui/react'
import useConfig from '@/hooks/useConfig'
import { FormLoader } from '../feedback/FormLoader'
import { ApiError } from '../feedback/ApiError'
import { SelectField } from './fields/SelectField'

type TProps = {
  document?: IDocument
  familyId?: string
  canModify?: boolean
  taxonomy?: TTaxonomy
  onSuccess?: (documentId: string) => void
}

export const DocumentForm = ({
  document: loadedDocument,
  familyId,
  canModify = false,
  taxonomy,
  onSuccess,
}: TProps) => {
  const { config, loading: configLoading, error: configError } = useConfig()
  const toast = useToast()
  const [formError, setFormError] = useState<IError | null | undefined>()

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IDocumentFormPost>({
    resolver: yupResolver(documentSchema),
  })

  // Ensure family_import_id is always set
  useEffect(() => {
    if (familyId || loadedDocument?.family_import_id) {
      if (familyId) setValue('family_import_id', familyId)
      else if (loadedDocument)
        setValue('family_import_id', loadedDocument?.family_import_id)
    }
  }, [familyId, loadedDocument, setValue])

  // Initialise form with existing document data
  useEffect(() => {
    if (loadedDocument) {
      reset({
        family_import_id: loadedDocument.family_import_id || familyId,
        variant_name: loadedDocument.variant_name
          ? {
              label: loadedDocument.variant_name,
              value: loadedDocument.variant_name,
            }
          : undefined,
        role: loadedDocument?.metadata?.role
          ? {
              label: loadedDocument?.metadata?.role[0],
              value: loadedDocument?.metadata?.role[0],
            }
          : undefined,
        type: loadedDocument?.metadata?.type
          ? {
              label: loadedDocument?.metadata?.type[0],
              value: loadedDocument?.metadata?.type[0],
            }
          : undefined,
        title: loadedDocument.title,
        source_url: loadedDocument.source_url ?? '',
        user_language_name: loadedDocument.user_language_name
          ? {
              label: loadedDocument.user_language_name,
              value: loadedDocument.user_language_name,
            }
          : undefined,
      })
    }
  }, [loadedDocument, familyId, reset])

  const invalidDocumentCreation = !loadedDocument && !familyId

  const handleFormSubmission = async (formData: IDocumentFormPost) => {
    // Ensure family_import_id is always present
    if (!formData.family_import_id && !familyId) {
      toast({
        title: 'Error',
        description: 'Family ID is required for document creation',
        status: 'error',
        position: 'top',
      })
      return
    }

    setFormError(null)

    const convertToModified = (
      data: IDocumentFormPost,
    ): IDocumentFormPostModified => {
      const metadata: IDocumentMetadata = { role: [], type: [] }
      if (data.role) {
        metadata.role = [data.role?.value]
      }
      if (data.type) {
        metadata.type = [data.type?.value]
      }

      return {
        family_import_id: data.family_import_id || familyId || '',
        title: data.title,
        metadata: metadata,
        source_url: data.source_url || null,
        variant_name: data.variant_name?.value || null,
        user_language_name: data.user_language_name?.value || null,
      }
    }

    const modifiedDocumentData = convertToModified(formData)

    try {
      if (loadedDocument) {
        const updateResult = await updateDocument(
          modifiedDocumentData,
          loadedDocument.import_id,
        )
        toast({
          title: 'Document has been successfully updated',
          status: 'success',
          position: 'top',
        })
        onSuccess && onSuccess(updateResult.response.import_id)
      } else {
        const createResult = await createDocument(modifiedDocumentData)
        toast({
          title: 'Document has been successfully created',
          status: 'success',
          position: 'top',
        })
        onSuccess && onSuccess(createResult.response)
      }
    } catch (error) {
      setFormError(error as IError)
      toast({
        title: loadedDocument
          ? 'Document Update Failed'
          : 'Document Creation Failed',
        description: (error as IError)?.message,
        status: 'error',
        position: 'top',
      })
    }
  }

  const onSubmit: SubmitHandler<IDocumentFormPost> = (data) => {
    return handleFormSubmission(data)
  }

  return (
    <>
      {invalidDocumentCreation && (
        <Box>
          <Text color={'red.500'}>Invalid Document creation</Text>
          <Text fontSize='xs' color={'gray.500'}>
            A document must be linked to a family, please select a family
          </Text>
        </Box>
      )}
      {configError && <ApiError error={configError} />}
      {configLoading && <FormLoader />}
      {!taxonomy && (
        <ApiError
          message={NO_TAXONOMY_ERROR}
          detail={BACK_TO_FAMILIES_ERROR_DETAIL}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap='4' mb={12} align={'stretch'}>
          {formError && <ApiError error={formError} />}
          <FormControl isRequired isReadOnly isDisabled>
            <FormLabel>Family ID</FormLabel>
            <Input
              bg='white'
              {...register('family_import_id')}
              value={familyId || loadedDocument?.family_import_id || ''}
              readOnly
            />
            <FormHelperText>This field is not editable</FormHelperText>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input bg='white' {...register('title')} />
          </FormControl>

          <FormControl isInvalid={!!errors.source_url}>
            <FormLabel>Source URL</FormLabel>
            <Input bg='white' {...register('source_url')} />
            <FormErrorMessage role='error'>
              {errors.source_url && errors.source_url.message}
            </FormErrorMessage>
          </FormControl>

          <SelectField
            name='role'
            label='Role'
            control={control}
            options={taxonomy?._document?.role?.allowed_values || []}
            isMulti={false}
            isRequired={true}
            isClearable={false}
          />

          <SelectField
            name='type'
            label='Type'
            control={control}
            options={taxonomy?._document?.type?.allowed_values || []}
            isMulti={false}
            isRequired={true}
            isClearable={false}
          />

          <SelectField
            name='variant_name'
            label='Variant'
            control={control}
            options={
              config?.document?.variants?.map((option) => ({
                value: option,
                label: option,
              })) || []
            }
            isMulti={false}
            isRequired={false}
            isClearable={true}
          />

          <SelectField
            name='user_language_name'
            label='Language'
            control={control}
            options={config?.languagesSorted || []}
            isMulti={false}
            isRequired={false}
            isClearable={true}
          />

          <ButtonGroup isDisabled={!canModify}>
            <Button
              type='submit'
              colorScheme='blue'
              isLoading={isSubmitting}
              isDisabled={!canModify || invalidDocumentCreation}
            >
              {(loadedDocument ? 'Update ' : 'Create new ') + ' Document'}
            </Button>
          </ButtonGroup>
        </VStack>
      </form>
    </>
  )
}
