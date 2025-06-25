import { useEffect, useRef, useState, useCallback } from 'react'
import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
  Controller,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ICorpus, ICorpusFormPost, ICorpusFormPut, IError } from '@/interfaces'
import { corpusSchema } from '@/schemas/corpusSchema'
import { createCorpus, updateCorpus } from '@/api/Corpora'
import {
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  Button,
  ButtonGroup,
  FormErrorMessage,
  useToast,
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
import { stripHtml } from '@/utils/stripHtml'
import { convertEmptyToNull } from '@/utils/convertEmptyToNull'
import { TextField } from './fields/TextField'
import { ImportIdSection } from './sections/ImportIdSection'
import { FormLoader } from '../feedback/FormLoader'
import useCorpusTypes from '@/hooks/useCorpusTypes'
import useOrganisations from '@/hooks/useOrganisations'

type TProps = {
  corpus?: ICorpus
}

export interface ICorpusFormSubmit {
  import_id?: string
  import_id_part1: {
    label?: string | undefined
    value?: string | undefined
  } | null
  import_id_part2?: string
  import_id_part3?: string
  import_id_part4?: string
  title: string
  description?: string | null
  corpus_text: string
  corpus_image_url?: string | null
  corpus_type_name: { label: string; value: string }
  corpus_type_description: string
  organisation_id: { label: string; value: number }
}

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
  } = useForm<ICorpusFormSubmit>({
    resolver: yupResolver(corpusSchema),
    context: {
      isNewCorpus: loadedCorpus ? false : true,
    },
    defaultValues: {
      import_id_part2: 'corpus',
      import_id_part4: 'n0000',
    },
  })
  const { config, loading: configLoading, error: configError } = useConfig()
  const {
    corpusTypes,
    error: corpusTypesError,
    loading: corpusTypesLoading,
  } = useCorpusTypes()
  const {
    organisations,
    error: organisationsError,
    loading: organisationsLoading,
  } = useOrganisations()

  const initialDescription = useRef<string | undefined>(
    loadedCorpus?.corpus_type_description,
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isDescriptionManuallyEdited, setIsDescriptionManuallyEdited] =
    useState(false)

  const handleFormSubmission = useCallback(
    async (formValues: ICorpusFormSubmit) => {
      setFormError(null)

      if (!loadedCorpus && !formValues.import_id_part1) {
        const e: IError = {
          status: 400,
          detail: 'Import ID Part 1 is required',
          message: 'Import ID Part 1 is required',
          returnPage: '/corpora',
        }
        setFormError(e)
      }

      // Check if description has actually changed from initial value
      if (formValues.corpus_type_description !== initialDescription.current) {
        setIsDescriptionManuallyEdited(true)
      }

      // Only check for corpus type description changes if updating an existing corpus
      if (
        loadedCorpus &&
        formValues.corpus_type_description !== initialDescription.current &&
        !isConfirmed
      ) {
        setIsModalOpen(true)
        return
      }

      if (loadedCorpus) {
        const formData: ICorpusFormPut = {
          title: formValues.title,
          description: formValues.description || null,
          corpus_text: stripHtml(formValues.corpus_text || ''),
          corpus_image_url: convertEmptyToNull(formValues.corpus_image_url),
          corpus_type_description: formValues.corpus_type_description,
        }

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
        import_id: `${formValues.import_id_part1?.value}.${formValues.import_id_part2}.${formValues.import_id_part3}.${formValues.import_id_part4}`,
        title: formValues.title,
        description: formValues.description || null,
        corpus_text: stripHtml(formValues.corpus_text || ''),
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
      initialDescription,
      navigate,
      toast,
      setFormError,
    ],
  )

  const onSubmit: SubmitHandler<ICorpusFormSubmit> = useCallback(
    (data) => {
      handleFormSubmission(data).catch((error: IError) => {
        console.error(error)
      })
    },
    [handleFormSubmission],
  )

  const onSubmitErrorHandler: SubmitErrorHandler<ICorpusFormSubmit> =
    useCallback((errors) => {
      console.error(errors)
    }, [])

  const handleModalConfirm = () => {
    setIsConfirmed(true)
    setIsModalOpen(false)
  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
  }

  const handleFormSubmissionWithConfirmation = useCallback(() => {
    if (isConfirmed) {
      void handleSubmit(onSubmit, onSubmitErrorHandler)().catch((error) => {
        console.error('Form submission error:', error)
      })
    }
  }, [isConfirmed, handleSubmit, onSubmit, onSubmitErrorHandler])

  const updateCorpusTypeDescription = useCallback(
    (typeName: string | undefined) => {
      if (!isDescriptionManuallyEdited) {
        const selectedType = corpusTypes.find((ct) => ct.name === typeName)
        void setValue(
          'corpus_type_description',
          selectedType?.description || '',
          {
            shouldDirty: true,
          },
        )
      }
    },
    [corpusTypes, setValue, isDescriptionManuallyEdited],
  )

  const getOrganisationDisplayNameById = useCallback(
    (organisationId: number): string | undefined => {
      const organisation = config?.corpora?.find(
        (corpus) => corpus.organisation?.id === organisationId,
      )
      return organisation?.organisation?.display_name
    },
    [config?.corpora],
  )

  const watchedCorpusTypeName = watch('corpus_type_name')
  useEffect(() => {
    if (watchedCorpusTypeName) {
      updateCorpusTypeDescription(watchedCorpusTypeName.label)
    }
  }, [watchedCorpusTypeName, config, updateCorpusTypeDescription])

  useEffect(() => {
    handleFormSubmissionWithConfirmation()
  }, [handleFormSubmissionWithConfirmation])

  useEffect(() => {
    if (loadedCorpus && !configLoading) {
      const orgName = getOrganisationDisplayNameById(
        loadedCorpus.organisation_id,
      )
      reset({
        import_id: loadedCorpus.import_id || '',
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
      updateCorpusTypeDescription(loadedCorpus.corpus_type_name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedCorpus, configLoading, getOrganisationDisplayNameById, reset])

  const corpusTextOnChange = (html: string) => {
    if (stripHtml(html) === '') {
      return setValue('corpus_text', '', { shouldDirty: true })
    }
    setValue('corpus_text', html, { shouldDirty: true })
  }

  const watchedOrganisation = watch('organisation_id')
  const watchedImportIdPart1 = watch('import_id_part1')

  return (
    <>
      {configError && <ApiError error={configError} />}
      {configLoading && <FormLoader />}
      {corpusTypesError && <ApiError error={corpusTypesError} />}
      {organisationsError && <ApiError error={organisationsError} />}

      <form onSubmit={handleSubmit(onSubmit, onSubmitErrorHandler)}>
        <VStack gap='4' mb={12} align={'stretch'}>
          {formError && <ApiError error={formError} />}

          {loadedCorpus && (
            <TextField
              name='import_id'
              label='Import ID'
              control={control}
              isRequired={true}
              showHelperText={true}
              isDisabled={true}
            />
          )}

          <TextField
            name='title'
            label='Title'
            control={control}
            isRequired={true}
          />

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
            <FormLabel htmlFor='corpus-text-editor'>
              Corpus Text
              <Tooltip label='This is exposed on the navigator application as the public facing description of this corpus'>
                <Icon as={InfoOutlineIcon} ml={2} cursor='pointer' />
              </Tooltip>
            </FormLabel>
            <WYSIWYG
              id='corpus-text-editor'
              html={loadedCorpus?.corpus_text || ''}
              onChange={corpusTextOnChange}
            />
          </FormControl>

          <TextField
            name='corpus_image_url'
            label='Corpus Image URL'
            control={control}
            isRequired={false}
          />

          {!corpusTypesLoading && (
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
                  <div data-testid='corpus-type-select'>
                    <CRSelect
                      chakraStyles={chakraStylesSelect}
                      isClearable={true}
                      isMulti={false}
                      isSearchable={true}
                      options={
                        corpusTypes.map((ct) => ({
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
          )}

          {loadedCorpus && (
            <FormControl
              isRequired
              isInvalid={!!errors.corpus_type_description}
            >
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

          {!organisationsLoading && (
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
                      options={Array.from(
                        new Set(organisations.map((corpus) => corpus?.id)),
                      ).map((id) => {
                        const corpus = organisations.find(
                          (corpus) => corpus?.id === id,
                        )
                        return {
                          label: corpus?.display_name,
                          value: id,
                        }
                      })}
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
          )}

          {!loadedCorpus && config && !configLoading && (
            <ImportIdSection
              corpora={config?.corpora || []}
              watchedOrganisation={watchedOrganisation}
              watchedImportIdPart1={watchedImportIdPart1}
              control={control}
              setValue={setValue}
            />
          )}

          <Modal isOpen={isModalOpen} onClose={handleModalCancel}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirm Update</ModalHeader>
              <ModalCloseButton />
              <ModalBody data-testid='modal-body'>
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
              {(loadedCorpus ? 'Update ' : 'Create new ') + 'Corpus'}
            </Button>
          </ButtonGroup>
        </VStack>
      </form>
    </>
  )
}
