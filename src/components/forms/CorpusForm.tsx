import { useEffect, useRef, useState, useCallback } from 'react'
import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
  Controller,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  IConfigCorpora,
  ICorpus,
  ICorpusFormPost,
  ICorpusFormPut,
  IError,
} from '@/interfaces'
import { corpusSchema } from '@/schemas/corpusSchema'
import { createCorpus, updateCorpus } from '@/api/Corpora'
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Button,
  ButtonGroup,
  FormErrorMessage,
  useToast,
  FormHelperText,
  Tooltip,
  Icon,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  Modal,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../feedback/ApiError'
import { chakraStylesSelect } from '@/styles/chakra'
import { Select as CRSelect } from 'chakra-react-select'
import useConfig from '@/hooks/useConfig'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { WYSIWYG } from '../form-components/WYSIWYG'
import * as yup from 'yup'
import { stripHtml } from '@/utils/stripHtml'

interface CorpusType {
  name: string
  description: string
}

type TProps = {
  corpus?: ICorpus
}

type CorpusFormData = yup.InferType<typeof corpusSchema>

export const CorpusForm = ({ corpus: loadedCorpus }: TProps) => {
  const navigate = useNavigate()
  const toast = useToast()
  const [formError, setFormError] = useState<IError | null | undefined>()
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    watch,
  } = useForm<CorpusFormData>({
    resolver: yupResolver(corpusSchema),
  })
  const { config, loading: configLoading, error: configError } = useConfig()

  const initialDescriptionRef = useRef<string | undefined>(
    loadedCorpus?.corpus_type_description,
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const handleFormSubmission = useCallback(
    async (formValues: CorpusFormData) => {
      setFormError(null)

      // Only check for corpus type description changes if updating an existing corpus
      if (
        loadedCorpus &&
        formValues.corpus_type_description !== initialDescriptionRef.current &&
        !isConfirmed
      ) {
        setIsModalOpen(true)
        return
      }

      const convertEmptyToNull = (
        value: string | undefined | null,
      ): string | null => {
        return !value || value.trim() === '' ? null : value
      }

      if (loadedCorpus) {
        const formData: ICorpusFormPut = {
          title: formValues.title,
          description: formValues.description,
          corpus_text: convertEmptyToNull(formValues.corpus_text),
          corpus_image_url: convertEmptyToNull(formValues.corpus_image_url),
          corpus_type_description: formValues.corpus_type_description,
        }
        console.log(formData)

        return await updateCorpus(formData, loadedCorpus.import_id)
          .then(() => {
            toast.closeAll()
            toast({
              title: 'Corpus has been successfully updated',
              status: 'success',
              position: 'top',
            })
            navigate('/corpora')
          })
          .catch((error: IError) => {
            console.error('❌ Error during form submission:', error)
            setFormError(error)
            toast({
              title: 'Corpus has not been updated',
              description: error.message,
              status: 'error',
              position: 'top',
            })
          })
      }

      const formData: ICorpusFormPost = {
        title: formValues.title,
        description: formValues.description,
        corpus_text: convertEmptyToNull(formValues.corpus_text),
        corpus_image_url: convertEmptyToNull(formValues.corpus_image_url),
        corpus_type_name: formValues.corpus_type_name.value,
        organisation_id: formValues.organisation_id.value,
      }

      return await createCorpus(formData)
        .then(() => {
          toast.closeAll()
          toast({
            title: 'Corpus has been successfully created',
            status: 'success',
            position: 'top',
          })
          navigate(`/corpora`)
        })
        .catch((error: IError) => {
          console.error('❌ Error during form submission:', error)
          setFormError(error)
          toast({
            title: 'Corpus has not been created',
            description: error.message,
            status: 'error',
            position: 'top',
          })
        })
    },
    [
      loadedCorpus,
      isConfirmed,
      initialDescriptionRef,
      navigate,
      toast,
      setFormError,
    ],
  )

  const onSubmit: SubmitHandler<CorpusFormData> = useCallback(
    (data) => {
      void handleFormSubmission(data).catch((error: IError) => {
        console.error(error)
      })
    },
    [handleFormSubmission],
  )

  const onSubmitErrorHandler: SubmitErrorHandler<CorpusFormData> = useCallback(
    (errors) => {
      console.error(errors)
    },
    [],
  )

  const handleModalConfirm = () => {
    setIsConfirmed(true)
    setIsModalOpen(false)
  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
  }

  const handleFormSubmissionWithConfirmation = useCallback(() => {
    if (isConfirmed) {
      void handleSubmit(onSubmit, onSubmitErrorHandler)()
    }
  }, [isConfirmed, handleSubmit, onSubmit, onSubmitErrorHandler])

  /**
   * Generate a list of unique corpus type dictionaries.
   *
   * @param corpora - List of corpus items.
   * @returns List of unique corpus type dictionaries.
   */
  const getUniqueCorpusTypes = (corpora: IConfigCorpora[]): CorpusType[] => {
    const seen = new Set<string>()
    const uniqueCorpusTypes: CorpusType[] = []

    corpora.forEach((c) => {
      const uniqueKey = `${c.corpus_type}-${c.corpus_type_description}`
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey)
        uniqueCorpusTypes.push({
          name: c.corpus_type,
          description: c.corpus_type_description,
        })
      }
    })

    return uniqueCorpusTypes
  }
  const uniqueCorpusTypes = getUniqueCorpusTypes(config?.corpora || [])

  const updateCorpusTypeDescription = useCallback(
    (typeName: string | undefined) => {
      const selectedType = uniqueCorpusTypes.find((ct) => ct.name === typeName)
      setValue('corpus_type_description', selectedType?.description || '', {
        shouldDirty: true,
      })
    },
    [uniqueCorpusTypes, setValue],
  )

  const getOrganisationNameById = useCallback(
    (organisationId: number): string | undefined => {
      const organisation = config?.corpora?.find(
        (corpus) => corpus.organisation?.id === organisationId,
      )
      return organisation?.organisation?.name
    },
    [config?.corpora],
  )

  useEffect(() => {
    handleFormSubmissionWithConfirmation()
  }, [handleFormSubmissionWithConfirmation])

  const watchedCorpusTypeName = watch('corpus_type_name')

  useEffect(() => {
    if (watchedCorpusTypeName) {
      updateCorpusTypeDescription(watchedCorpusTypeName.label)
    }
  }, [watchedCorpusTypeName, updateCorpusTypeDescription])

  useEffect(() => {
    if (loadedCorpus && !configLoading) {
      const orgName = getOrganisationNameById(loadedCorpus.organisation_id)
      reset({
        title: loadedCorpus.title || '',
        description: loadedCorpus.description || '',
        corpus_text: loadedCorpus.corpus_text || '',
        corpus_image_url: loadedCorpus.corpus_image_url || '',
        corpus_type_name: loadedCorpus.corpus_type_name
          ? {
              label: loadedCorpus.corpus_type_name,
              value: loadedCorpus.corpus_type_name,
            }
          : undefined,
        corpus_type_description: loadedCorpus.corpus_type_description || '',
        organisation_id: loadedCorpus.organisation_id
          ? {
              label: orgName,
              value: loadedCorpus.organisation_id,
            }
          : undefined,
      })
    }
  }, [loadedCorpus, configLoading, getOrganisationNameById, reset])

  const corpusTextOnChange = (html: string) => {
    if (stripHtml(html) === '') {
      return setValue('corpus_text', '', { shouldDirty: true })
    }
    setValue('corpus_text', html, { shouldDirty: true })
  }

  return (
    <>
      {configError && <ApiError error={configError} />}

      <form onSubmit={handleSubmit(onSubmit, onSubmitErrorHandler)}>
        <VStack gap='4' mb={12} align={'stretch'}>
          {formError && <ApiError error={formError} />}

          {loadedCorpus && (
            <FormControl isRequired isReadOnly isDisabled>
              <FormLabel>Import ID</FormLabel>
              <Input bg='white' value={loadedCorpus?.import_id} />
              <FormHelperText>You cannot edit this</FormHelperText>
            </FormControl>
          )}
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input bg='white' {...register('title')} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>
              Description
              <Tooltip label='This is the internally used description of this corpus'>
                <Icon as={InfoOutlineIcon} ml={2} cursor='pointer' />
              </Tooltip>
            </FormLabel>
            <Textarea
              height={'100px'}
              bg='white'
              {...register('description')}
            />
          </FormControl>
          <FormControl>
            <FormLabel>
              Corpus Text
              <Tooltip label='This is exposed on the navigator application as the public facing description of this corpus'>
                <Icon as={InfoOutlineIcon} ml={2} cursor='pointer' />
              </Tooltip>
            </FormLabel>
            <WYSIWYG
              html={loadedCorpus?.corpus_text || ''}
              onChange={corpusTextOnChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Corpus Image URL</FormLabel>
            <Input bg='white' {...register('corpus_image_url')} />
          </FormControl>
          <Controller
            control={control}
            name='corpus_type_name'
            render={({ field }) => (
              <FormControl
                as='fieldset'
                isRequired
                isInvalid={!!errors.corpus_type_name}
              >
                <FormLabel as='legend'>Corpus Type Name</FormLabel>
                <div data-testid='language-select'>
                  <CRSelect
                    chakraStyles={chakraStylesSelect}
                    isClearable={true}
                    isMulti={false}
                    isSearchable={true}
                    options={
                      uniqueCorpusTypes.map((ct) => ({
                        label: ct.name,
                        value: ct.name,
                      })) || []
                    }
                    isDisabled={!!loadedCorpus}
                    {...field}
                  />
                </div>
                <FormErrorMessage>
                  {errors.corpus_type_name?.message}
                </FormErrorMessage>
              </FormControl>
            )}
          />
          {loadedCorpus && (
            <FormControl isRequired>
              <FormLabel>
                Corpus Type Description
                <Tooltip label='Updating this will also apply this change to all other corpora of this type'>
                  <Icon as={InfoOutlineIcon} ml={2} cursor='pointer' />
                </Tooltip>
              </FormLabel>
              <Textarea
                height={'100px'}
                bg='white'
                {...register('corpus_type_description')}
              />
            </FormControl>
          )}

          <Controller
            control={control}
            name='organisation_id'
            render={({ field }) => (
              <FormControl
                as='fieldset'
                isRequired
                isInvalid={!!errors.organisation_id}
              >
                <FormLabel as='legend'>Organisation</FormLabel>
                <div data-testid='organisation-select'>
                  <CRSelect
                    chakraStyles={chakraStylesSelect}
                    isClearable={true}
                    isMulti={false}
                    isSearchable={true}
                    options={
                      Array.from(
                        new Set(
                          config?.corpora?.map((corpus) => ({
                            label: corpus.organisation?.name,
                            value: corpus.organisation?.id,
                          })),
                        ),
                      ).map((org) => ({
                        label: org.label,
                        value: org.value,
                      })) || []
                    }
                    isDisabled={!!loadedCorpus}
                    {...field}
                  />
                </div>
                <FormErrorMessage>
                  {errors.organisation_id?.message}
                </FormErrorMessage>
              </FormControl>
            )}
          />

          <Modal isOpen={isModalOpen} onClose={handleModalCancel}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirm Update</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <p>
                  You have changed the corpus type description of{' '}
                  <strong>
                    {getValues('corpus_type_name')?.label || 'unknown'}
                  </strong>
                  .
                </p>
                <br></br>
                <p>
                  This will update all corpora with the type{' '}
                  <strong>
                    {getValues('corpus_type_name')?.label || 'unknown'}
                  </strong>{' '}
                  with the description{' '}
                  <em style={{ color: 'blue' }}>
                    {getValues('corpus_type_description') || 'unknown'}
                  </em>
                  .
                </p>
                <br></br>
                Do you wish to proceed?
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={handleModalConfirm}>
                  Confirm
                </Button>
                <Button variant='ghost' onClick={handleModalCancel}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <ButtonGroup>
            <Button type='submit' colorScheme='blue' disabled={isSubmitting}>
              {(loadedCorpus ? 'Update ' : 'Create new ') + ' Corpus'}
            </Button>
          </ButtonGroup>
        </VStack>
      </form>
    </>
  )
}
