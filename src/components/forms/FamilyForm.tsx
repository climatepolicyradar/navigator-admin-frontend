import { useEffect, useState, useMemo, useCallback } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useBlocker, useNavigate } from 'react-router-dom'
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
  Text,
  Button,
  ButtonGroup,
  FormErrorMessage,
  useToast,
  SkeletonText,
  Divider,
  AbsoluteCenter,
  useDisclosure,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'

import { familySchema } from '@/schemas/familySchema'
import useCorpusFromConfig from '@/hooks/useCorpusFromConfig'
import useConfig from '@/hooks/useConfig'
import useTaxonomy from '@/hooks/useTaxonomy'
import useCollections from '@/hooks/useCollections'

import { DynamicMetadataField } from './DynamicMetadataFields'
import { generateOptions } from '@/utils/generateOptions'
import { SelectField } from './fields/SelectField'
import { TextField } from './fields/TextField'
import { RadioGroupField } from './fields/RadioGroupField'
import { WYSIWYGField } from './fields/WYSIWYGField'
import { MetadataSection } from './sections/MetadataSection'
import { DocumentSection } from './sections/DocumentSection'
import { EventSection } from './sections/EventSection'
import { UnsavedChangesModal } from './modals/UnsavedChangesModal'
import { ReadOnlyFields } from './ReadOnlyFields'
import { EntityEditDrawer } from '../drawers/EntityEditDrawer'

import {
  IFamilyForm,
  TFamilyFormPost,
  TFamilyFormPostMetadata,
  IUNFCCCMetadata,
  ICCLWMetadata,
} from '@/types/metadata'
import { TChildEntity } from '@/types/entities'
import { canModify } from '@/utils/canModify'
import { getCountries } from '@/utils/extractNestedGeographyData'
import { decodeToken } from '@/utils/decodeToken'
import { stripHtml } from '@/utils/stripHtml'
import {
  CORPUS_METADATA_CONFIG,
  generateDynamicValidationSchema,
} from '@/schemas/dynamicValidationSchema'
import { createFamily, updateFamily } from '@/api/Families'
import { deleteDocument } from '@/api/Documents'
import { baseFamilySchema, createFamilySchema } from '@/schemas/familySchema'

interface FamilyFormProps {
  family?: TFamily
}

export const FamilyForm: React.FC<FamilyFormProps> = ({
  family: loadedFamily,
}) => {
  const [isLeavingModalOpen, setIsLeavingModalOpen] = useState(false)
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const { config, error: configError, loading: configLoading } = useConfig()
  const {
    collections,
    error: collectionsError,
    loading: collectionsLoading,
  } = useCollections('')
  const toast = useToast()
  const [formError, setFormError] = useState<IError | null | undefined>()

  // Initialize corpus and taxonomy first
  const initialCorpusInfo = useCorpusFromConfig(
    config?.corpora,
    loadedFamily?.corpus_import_id,
    loadedFamily?.corpus_import_id,
  )
  const initialTaxonomy = useTaxonomy(
    initialCorpusInfo?.corpus_type,
    initialCorpusInfo?.taxonomy,
    loadedFamily?.corpus_import_id,
  )

  // Create initial validation schema
  const validationSchema = useMemo(() => {
    const metadataSchema = generateDynamicValidationSchema(
      initialTaxonomy,
      initialCorpusInfo,
    )
    return createFamilySchema(metadataSchema)
  }, [initialTaxonomy, initialCorpusInfo])

  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
    trigger,
  } = useForm<IFamilyForm>({
    resolver: yupResolver(validationSchema),
  })

  // Watch for corpus changes and update schema
  const watchCorpus = watch('corpus')
  const corpusInfo = useCorpusFromConfig(
    config?.corpora,
    loadedFamily?.corpus_import_id,
    watchCorpus?.value,
  )
  const taxonomy = useTaxonomy(
    corpusInfo?.corpus_type,
    corpusInfo?.taxonomy,
    watchCorpus?.value,
  )

  // Update validation schema when corpus/taxonomy changes
  useEffect(() => {
    const metadataSchema = generateDynamicValidationSchema(taxonomy, corpusInfo)
    const newSchema = createFamilySchema(metadataSchema)
    // Re-trigger form validation with new schema
    trigger()
  }, [taxonomy, corpusInfo])

  const [editingEntity, setEditingEntity] = useState<TChildEntity | undefined>()
  const [editingEvent, setEditingEvent] = useState<IEvent | undefined>()
  const [editingDocument, setEditingDocument] = useState<
    IDocument | undefined
  >()
  const [familyDocuments, setFamilyDocuments] = useState<string[]>([])
  const [familyEvents, setFamilyEvents] = useState<string[]>(
    loadedFamily?.events || [],
  )
  const [updatedEvent, setUpdatedEvent] = useState<string>('')
  const [updatedDocument, setUpdatedDocument] = useState<string>('')

  const userAccess = useMemo(() => {
    const token = localStorage.getItem('token')
    if (!token) return { canModify: false, isSuperUser: false }
    const decodedToken = decodeToken(token)
    return {
      canModify: canModify(
        loadedFamily ? String(loadedFamily.organisation) : null,
        decodedToken?.is_superuser,
        decodedToken?.authorisation,
      ),
      isSuperUser: decodedToken?.is_superuser || false,
    }
  }, [loadedFamily])

  const handleFormSubmission = async (formData: IFamilyForm) => {
    setIsFormSubmitting(true)
    setFormError(null)

    const familyMetadata = generateFamilyMetadata(formData, corpusInfo)
    const familyData = generateFamilyData(formData, familyMetadata)

    try {
      if (loadedFamily) {
        await updateFamily(familyData, loadedFamily.import_id)
        toast({
          title: 'Family has been successfully updated',
          status: 'success',
          position: 'top',
        })
      } else {
        const response = await createFamily(familyData)
        toast({
          title: 'Family has been successfully created',
          status: 'success',
          position: 'top',
        })
        navigate(`/family/${response.response}/edit`)
      }
    } catch (error) {
      setFormError(error as IError)
      toast({
        title: `Family has not been ${loadedFamily ? 'updated' : 'created'}`,
        description: (error as IError).message,
        status: 'error',
        position: 'top',
      })
    } finally {
      setIsFormSubmitting(false)
    }
  }

  const onSubmit: SubmitHandler<IFamilyForm> = (data) => {
    handleFormSubmission(data).catch((error: IError) => {
      console.error(error)
    })
  }

  const onSubmitErrorHandler = (error: object) => {
    console.log('onSubmitErrorHandler', error)
    const submitHandlerErrors = error as {
      [key: string]: { message: string; type: string }
    }
    Object.keys(submitHandlerErrors).forEach((key) => {
      if (key === 'summary')
        setError('summary', {
          type: 'required',
          message: 'Summary is required',
        })
    })
  }

  const onAddNewEntityClick = (entityType: TChildEntity) => {
    setEditingEntity(entityType)
    if (entityType === 'document') setEditingDocument(undefined)
    if (entityType === 'event') setEditingEvent(undefined)
    onOpen()
  }

  const onEditEntityClick = (
    entityType: TChildEntity,
    entity: IEvent | IDocument,
  ) => {
    setEditingEntity(entityType)
    if (entityType === 'document') setEditingDocument(entity as IDocument)
    if (entityType === 'event') setEditingEvent(entity as IEvent)
    onOpen()
  }

  const onDocumentFormSuccess = (documentId: string) => {
    onClose()
    if (familyDocuments.includes(documentId))
      setFamilyDocuments([...familyDocuments])
    else setFamilyDocuments([...familyDocuments, documentId])
    setUpdatedDocument(documentId)
  }

  const onDocumentDeleteClick = async (documentId: string) => {
    toast({
      title: 'Document deletion in progress',
      status: 'info',
      position: 'top',
    })
    await deleteDocument(documentId)
      .then(() => {
        toast({
          title: 'Document has been successful deleted',
          status: 'success',
          position: 'top',
        })
        const index = familyDocuments.indexOf(documentId)
        if (index > -1) {
          const newDocs = [...familyDocuments]
          newDocs.splice(index, 1)
          setFamilyDocuments(newDocs)
        }
      })
      .catch((error: IError) => {
        toast({
          title: 'Document has not been deleted',
          description: error.message,
          status: 'error',
          position: 'top',
        })
      })
  }

  const summaryOnChange = (html: string) => {
    if (stripHtml(html) === '') {
      return setValue('summary', '', { shouldDirty: true })
    }
    setValue('summary', html, { shouldDirty: true })
  }

  const onEventFormSuccess = (eventId: string) => {
    onClose()
    if (familyEvents.includes(eventId)) setFamilyEvents([...familyEvents])
    else setFamilyEvents([...familyEvents, eventId])
    setUpdatedEvent(eventId)
  }

  const canLoadForm =
    !configLoading && !collectionsLoading && !configError && !collectionsError

  console.log('Loading tax data:', taxonomy)
  useEffect(() => {
    if (loadedFamily && collections) {
      console.log(loadedFamily)
      setFamilyDocuments(loadedFamily.documents || [])
      setFamilyEvents(loadedFamily.events || [])

      reset({
        title: loadedFamily.title,
        summary: loadedFamily.summary,
        collections:
          loadedFamily.collections
            ?.map((collectionId) => {
              const collection = collections.find(
                (c) => c.import_id === collectionId,
              )
              return collection
                ? {
                    value: collection.import_id,
                    label: collection.title,
                  }
                : null
            })
            .filter(Boolean) || [],
        geography: loadedFamily.geography
          ? {
              value: loadedFamily.geography,
              label:
                getCountries(config?.geographies).find(
                  (country) => country.value === loadedFamily.geography,
                )?.display_value || loadedFamily.geography,
            }
          : undefined,
        category: loadedFamily.category,
        corpus: {
          value: loadedFamily.corpus_import_id,
          label: loadedFamily.corpus_name,
        },
      })
    }
  }, [loadedFamily, collections, reset])

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !isFormSubmitting &&
      Object.keys(dirtyFields).length > 0 &&
      currentLocation.pathname !== nextLocation.pathname,
  )

  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (Object.keys(dirtyFields).length > 0 && !isFormSubmitting) {
        event.preventDefault()
        event.returnValue =
          'Are you sure you want leave? Changes that you made may not be saved.'
      }
    },
    [dirtyFields, isFormSubmitting],
  )

  useEffect(() => {
    if (blocker && blocker.state === 'blocked') {
      setIsLeavingModalOpen(true)
    }
  }, [blocker])

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [handleBeforeUnload])

  return (
    <>
      {!canLoadForm && (
        <SkeletonText mt='4' noOfLines={12} spacing='4' skeletonHeight='2' />
      )}
      {!userAccess.canModify && (
        <ApiError
          message={`You do not have permission to edit document families in ${corpusInfo?.title} `}
          detail='Please go back to the "Families" page, if you think there has been a mistake please contact the administrator.'
        />
      )}
      {(configError || collectionsError) && (
        <ApiError error={configError || collectionsError} />
      )}

      {canLoadForm && (
        <form onSubmit={handleSubmit(onSubmit, onSubmitErrorHandler)}>
          <VStack gap='4' mb={12} mt={4} align={'stretch'}>
            {formError && <ApiError error={formError} />}

            {loadedFamily && <ReadOnlyFields family={loadedFamily} />}

            <TextField
              name='title'
              label='Title'
              control={control}
              isRequired={true}
            />

            <WYSIWYGField
              name='summary'
              label='Summary'
              control={control}
              defaultValue={loadedFamily?.summary}
              onChange={summaryOnChange}
              error={errors.summary}
            />

            <SelectField
              name='collections'
              label='Collections'
              control={control}
              options={
                collections?.map((collection) => ({
                  value: collection.import_id,
                  label: collection.title,
                })) || []
              }
              isMulti={true}
              isRequired={false}
            />

            <SelectField
              name='geography'
              label='Geography'
              control={control}
              options={getCountries(config?.geographies).map((country) => ({
                value: country.id,
                label: country.display_value,
              }))}
              isMulti={false}
              isRequired={true}
            />

            {!loadedFamily && (
              <SelectField
                name='corpus'
                label='Corpus'
                control={control}
                options={
                  config?.corpora.map((corpus) => ({
                    value: corpus.corpus_import_id,
                    label: corpus.title,
                  })) || []
                }
                isRequired={true}
              />
            )}

            <RadioGroupField
              name='category'
              label='Category'
              control={control}
              options={[
                { value: 'Executive', label: 'Executive' },
                { value: 'Legislative', label: 'Legislative' },
                { value: 'Litigation', label: 'Litigation' },
                { value: 'UNFCCC', label: 'UNFCCC' },
                { value: 'MCF', label: 'MCF' },
              ]}
              rules={{ required: true }}
            />

            {corpusInfo && (
              <MetadataSection
                corpusInfo={corpusInfo}
                taxonomy={taxonomy}
                control={control}
                errors={errors}
                loadedFamily={loadedFamily}
                reset={reset}
              />
            )}

            <Divider />

            <DocumentSection
              familyDocuments={familyDocuments}
              userCanModify={userAccess.canModify}
              onAddNew={onAddNewEntityClick}
              onEdit={onEditEntityClick}
              onDelete={onDocumentDeleteClick}
              updatedDocument={updatedDocument}
              setUpdatedDocument={setUpdatedDocument}
              isNewFamily={!loadedFamily}
            />

            <EventSection
              familyEvents={familyEvents}
              userCanModify={userAccess.canModify}
              onAddNew={onAddNewEntityClick}
              onEdit={onEditEntityClick}
              updatedEvent={updatedEvent}
              setUpdatedEvent={setUpdatedEvent}
              isNewFamily={!loadedFamily}
              onSetFamilyEvents={setFamilyEvents}
            />

            <ButtonGroup>
              <Button
                type='submit'
                colorScheme='blue'
                isLoading={isSubmitting}
                isDisabled={!userAccess.canModify}
              >
                {loadedFamily ? 'Update Family' : 'Create Family'}
              </Button>
            </ButtonGroup>
          </VStack>
        </form>
      )}

      <UnsavedChangesModal
        isOpen={isLeavingModalOpen}
        onClose={() => setIsLeavingModalOpen(false)}
        onConfirm={() => {
          blocker.proceed?.()
          setIsLeavingModalOpen(false)
        }}
      />

      {isOpen && editingEntity && (
        <EntityEditDrawer
          isOpen={isOpen}
          onClose={onClose}
          entity={editingEntity}
          document={editingDocument}
          event={editingEvent}
          onDocumentSuccess={onDocumentFormSuccess}
          onEventSuccess={onEventFormSuccess}
          familyId={loadedFamily?.import_id}
          taxonomy={taxonomy}
          canModify={userAccess.canModify}
        />
      )}
    </>
  )
}
