import { useEffect, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
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
  Select,
  FormErrorMessage,
} from '@chakra-ui/react'
import useConfig from '@/hooks/useConfig'
import { FormLoader } from '../feedback/FormLoader'
import { ApiError } from '../feedback/ApiError'

// import { generateLanguageOptions } from '@/utils/generateOptions'
// import { Select as CRSelect, ChakraStylesConfig } from 'chakra-react-select'

// const chakraStyles: ChakraStylesConfig = {
//   container: (provided) => ({
//     ...provided,
//     background: 'white',
//   }),
// }

// interface IDocumentForm extends Omit<IDocumentFormPost, 'user_language_name'> {
//   user_language_name: { label: string; value: string }
// }

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

  // const languages = useMemo(() => {
  //   return generateLanguageOptions(config?.languages || {})
  // }, [config])

  const handleFormSubmission = async (documentData: IDocumentFormPost) => {
    setFormError(null)

    // const documentDataWithLanguage: IDocumentFormPost = {
    //   ...documentData,
    //   user_language_name: documentData.user_language_name.value,
    // }

    if (loadedDocument) {
      return await updateDocument(documentData, loadedDocument.import_id)
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
        onSuccess && onSuccess(data.response)
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
    // Handle both loading an existing document and creating a new one (for a given family)
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
          <Text fontSize="xs" color={'gray.500'}>
            A document must be linked to a family, please select a family
          </Text>
        </Box>
      )}
      {configError && <ApiError error={configError} />}
      {configLoading && <FormLoader />}
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
          <Controller
            control={control}
            name="role"
            render={({ field }) => {
              return (
                <FormControl isRequired as="fieldset" isInvalid={!!errors.role}>
                  <FormLabel as="legend">Role</FormLabel>
                  <Select background="white" {...field}>
                    <option value="">Please select</option>
                    {config?.document?.roles.map((option) => (
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
            name="type"
            render={({ field }) => {
              return (
                <FormControl isRequired as="fieldset" isInvalid={!!errors.type}>
                  <FormLabel as="legend">Type</FormLabel>
                  <Select background="white" {...field}>
                    <option value="">Please select</option>
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
            name="variant_name"
            render={({ field }) => {
              return (
                <FormControl as="fieldset" isInvalid={!!errors.variant_name}>
                  <FormLabel as="legend">Variant</FormLabel>
                  <Select background="white" {...field}>
                    <option value="">Please select</option>
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
            name="user_language_name"
            render={({ field }) => {
              return (
                <FormControl
                  isRequired
                  as="fieldset"
                  isInvalid={!!errors.user_language_name}
                >
                  <FormLabel as="legend">Language</FormLabel>
                  <Select background="white" {...field}>
                    <option value="">Please select</option>
                    {Object.keys(config?.languages || {}).map((key) => (
                      <option key={key} value={config?.languages[key]}>
                        {config?.languages[key]}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>Please select a language</FormErrorMessage>
                </FormControl>
              )
            }}
          />
          {/* <Controller
            control={control}
            name="user_language_name"
            render={({ field }) => {
              return (
                <FormControl
                  isRequired
                  as="fieldset"
                  isInvalid={!!errors.user_language_name}
                >
                  <FormLabel as="legend">Language</FormLabel>
                  <CRSelect
                    chakraStyles={chakraStyles}
                    isClearable={false}
                    isMulti={false}
                    isSearchable={true}
                    options={languages}
                    {...field}
                  />
                  <FormErrorMessage>Please select a language</FormErrorMessage>
                </FormControl>
              )
            }}
          /> */}
          <ButtonGroup>
            <Button
              type="submit"
              colorScheme="blue"
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
