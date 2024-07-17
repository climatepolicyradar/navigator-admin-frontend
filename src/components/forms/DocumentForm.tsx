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
  canModify,
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
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(documentSchema),
  })
  const handleFormSubmission = async (formData: IDocumentFormPost) => {
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

      console.log(metadata)

      return {
        family_import_id: data.family_import_id,
        type: data.type,
        title: data.title,
        metadata: metadata,
        source_url: data.source_url || null,
        variant_name: data.variant_name || null,
        user_language_name: data.user_language_name?.label || null,
      }
    }

    const modifiedDocumentData = convertToModified(formData)

    if (loadedDocument) {
      return await updateDocument(
        modifiedDocumentData,
        loadedDocument.import_id,
      )
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

    return await createDocument(modifiedDocumentData)
      .then((data) => {
        toast.closeAll()
        toast({
          title: 'Document has been successfully created',
          status: 'success',
          position: 'top',
        })
        onSuccess && onSuccess(data.response)
      })
      .catch((error: IError) => {
        setFormError(error)
        toast({
          title: 'Document has not been created',
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
    // Handle both loading an existing document and creating a new one (for a given family)
    if (loadedDocument) {
      reset({
        family_import_id: loadedDocument.family_import_id,
        variant_name: loadedDocument.variant_name ?? '',
        role:
          'role' in loadedDocument.metadata
            ? loadedDocument.metadata.role[0]
            : '',
        type: loadedDocument.type ?? '',
        title: loadedDocument.title,
        source_url: loadedDocument.source_url ?? '',
        user_language_name: loadedDocument.user_language_name
          ? {
              label: loadedDocument.user_language_name,
              value: loadedDocument.user_language_name,
            }
          : undefined,
      })
    } else if (familyId) {
      reset({
        family_import_id: familyId,
      })
    }
  }, [loadedDocument, familyId, reset])

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
            <Input bg='white' {...register('family_import_id')} />
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
                    {config?.document?.types.map((option) => (
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
              onSubmit={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {(loadedDocument ? 'Update ' : 'Create new ') + ' Document'}
            </Button>
          </ButtonGroup>
        </VStack>
      </form>
    </>
  )
}
