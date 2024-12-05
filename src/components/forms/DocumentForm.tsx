import { useEffect, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
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
  IConfigTaxonomyCCLW,
  IConfigTaxonomyUNFCCC,
} from '@/interfaces'
import { createDocument, updateDocument } from '@/api/Documents'
import { documentSchema } from '@/schemas/documentSchema'
import { Select as CRSelect } from 'chakra-react-select'

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
  Select,
  FormErrorMessage,
} from '@chakra-ui/react'
import useConfig from '@/hooks/useConfig'
import { FormLoader } from '../feedback/FormLoader'
import { ApiError } from '../feedback/ApiError'
import { chakraStylesSelect } from '@/styles/chakra'

type TProps = {
  document?: IDocument
  familyId?: string
  canModify?: boolean
  taxonomy?: IConfigTaxonomyCCLW | IConfigTaxonomyUNFCCC
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
      setValue('family_import_id', familyId || loadedDocument?.family_import_id)
    }
  }, [familyId, loadedDocument, setValue])

  // Initialize form with existing document data
  useEffect(() => {
    if (loadedDocument) {
      reset({
        family_import_id: loadedDocument.family_import_id || familyId,
        variant_name: loadedDocument.variant_name ?? '',
        role: loadedDocument?.metadata?.role[0] ?? '',
        type: loadedDocument?.metadata?.type[0] ?? '',
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
        metadata.role = [data.role]
      }
      if (data.type) {
        metadata.type = [data.type]
      }

      return {
        family_import_id: data.family_import_id || familyId || '',
        title: data.title,
        metadata: metadata,
        source_url: data.source_url || null,
        variant_name: data.variant_name || null,
        user_language_name: data.user_language_name?.label || null,
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

          <Controller
            control={control}
            name='role'
            render={({ field }) => {
              return (
                <FormControl isRequired as='fieldset' isInvalid={!!errors.role}>
                  <FormLabel as='legend'>Role</FormLabel>
                  <Select background='white' {...field}>
                    <option value=''>Please select</option>
                    {taxonomy?._document?.role?.allowed_values.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>Please select a role</FormErrorMessage>
                </FormControl>
              )
            }}
          />

          <Controller
            control={control}
            name='type'
            render={({ field }) => {
              return (
                <FormControl isRequired as='fieldset' isInvalid={!!errors.type}>
                  <FormLabel as='legend'>Type</FormLabel>
                  <Select background='white' {...field}>
                    <option value=''>Please select</option>
                    {taxonomy?._document?.type?.allowed_values.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>Please select a type</FormErrorMessage>
                </FormControl>
              )
            }}
          />

          <Controller
            control={control}
            name='variant_name'
            render={({ field }) => {
              return (
                <FormControl as='fieldset' isInvalid={!!errors.variant_name}>
                  <FormLabel as='legend'>Variant</FormLabel>
                  <Select background='white' {...field}>
                    <option value=''>Please select</option>
                    {config?.document?.variants.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>Please select a type</FormErrorMessage>
                </FormControl>
              )
            }}
          />

          <Controller
            control={control}
            name='user_language_name'
            render={({ field }) => {
              return (
                <FormControl
                  as='fieldset'
                  isInvalid={!!errors.user_language_name}
                >
                  <FormLabel as='legend'>Language</FormLabel>
                  <div data-testid='language-select'>
                    <CRSelect
                      chakraStyles={chakraStylesSelect}
                      isClearable={true}
                      isMulti={false}
                      isSearchable={true}
                      options={config?.languagesSorted}
                      {...field}
                    />
                  </div>
                  <FormErrorMessage>
                    {errors.user_language_name?.message}
                  </FormErrorMessage>
                </FormControl>
              )
            }}
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
