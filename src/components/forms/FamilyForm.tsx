import { useEffect, useState, useMemo, useCallback } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useBlocker, useNavigate } from 'react-router-dom'
import {
  VStack,
  Button,
  ButtonGroup,
  useToast,
  SkeletonText,
  useDisclosure,
} from '@chakra-ui/react'
import * as yup from 'yup'
import useCorpusFromConfig from '@/hooks/useCorpusFromConfig'
import useConfig from '@/hooks/useConfig'
import useCollections from '@/hooks/useCollections'

import { SelectField } from './fields/SelectField'
import { TextField } from './fields/TextField'
import { RadioGroupField } from './fields/RadioGroupField'
import { WYSIWYGField } from './fields/WYSIWYGField'
import { MetadataSection } from './sections/MetadataSection'
import { DocumentSection } from './sections/DocumentSection'
import { EventSection } from './sections/EventSection'
import { UnsavedChangesModal } from './modals/UnsavedChangesModal'
import { ReadOnlyFields } from '../family/ReadOnlyFields'
import { EntityEditDrawer } from '../drawers/EntityEditDrawer'

import { TFamily, IFamilyFormPostBase } from '@/interfaces/Family'
import { canModify } from '@/utils/canModify'
import { getCountries } from '@/utils/extractNestedGeographyData'
import { decodeToken } from '@/utils/decodeToken'
import { stripHtml } from '@/utils/stripHtml'
import { generateDynamicValidationSchema } from '@/schemas/dynamicValidationSchema'
import { createFamily, updateFamily } from '@/api/Families'
import { deleteDocument } from '@/api/Documents'
import { deleteEvent } from '@/api/Events'
import { createFamilySchema } from '@/schemas/familySchema'
import { ApiError } from '../feedback/ApiError'
import { IDocument } from '@/interfaces/Document'
import { IEvent } from '@/interfaces/Event'
import { IError } from '@/interfaces/Auth'
import { IChakraSelect, IConfigCorpora, TTaxonomy } from '@/interfaces'
import {
  getMetadataHandler,
  TFamilyFormSubmit,
} from './metadata-handlers/familyForm'

export interface IFamilyFormBase {
  title: string
  summary: string
  geography: IChakraSelect
  category: string
  corpus: IChakraSelect
  collections?: IChakraSelect[]
}

type TChildEntity = 'event' | 'document'

type TProps = {
  family?: TFamily
}

export const FamilyForm = ({ family: loadedFamily }: TProps) => {
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

  // Determine corpus import ID based on loaded family or form input
  const getCorpusImportId = (
    loadedFamily?: TFamily,
    watchCorpus?: { value: string },
  ) => loadedFamily?.corpus_import_id || watchCorpus?.value

  // Initialise corpus and taxonomy first
  const initialCorpusInfo = useCorpusFromConfig(
    config?.corpora,
    getCorpusImportId(loadedFamily),
    getCorpusImportId(loadedFamily),
  )
  const initialTaxonomy = initialCorpusInfo
    ? initialCorpusInfo?.taxonomy
    : undefined

  // Create validation schema
  const createValidationSchema = useCallback(
    (currentTaxonomy?: TTaxonomy, currentCorpusInfo?: IConfigCorpora) => {
      const metadataSchema = generateDynamicValidationSchema(
        currentTaxonomy,
        currentCorpusInfo,
      )
      return createFamilySchema(metadataSchema)
    },
    [],
  )

  // Initial validation schema
  const validationSchema = useMemo(
    () =>
      createValidationSchema(
        initialTaxonomy,
        initialCorpusInfo,
      ) as unknown as yup.ObjectSchema<TFamilyFormSubmit>,
    [initialTaxonomy, initialCorpusInfo, createValidationSchema],
  )

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<TFamilyFormSubmit>({
    resolver: yupResolver<TFamilyFormSubmit>(validationSchema),
  })

  // Watch for corpus changes and update schema only when creating a new family
  const watchCorpus = !loadedFamily ? watch('corpus') : undefined
  const corpusInfo = useCorpusFromConfig(
    config?.corpora,
    getCorpusImportId(loadedFamily),
    getCorpusImportId(loadedFamily, watchCorpus),
  )
  const taxonomy = corpusInfo?.taxonomy

  // Determine if the corpus is an MCF type
  const isMCFCorpus = useMemo(() => {
    return (
      watchCorpus?.value?.startsWith('MCF') ||
      loadedFamily?.corpus_import_id?.startsWith('MCF')
    )
  }, [watchCorpus?.value, loadedFamily?.corpus_import_id])

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
        decodedToken?.is_superuser ?? false,
        decodedToken?.authorisation,
      ),
      isSuperUser: decodedToken?.is_superuser || false,
    }
  }, [loadedFamily])

  const handleFormSubmission = async (formData: TFamilyFormSubmit) => {
    setIsFormSubmitting(true)
    setFormError(null)

    // Validate corpus type
    if (!corpusInfo?.corpus_type) {
      throw new Error('No corpus type specified')
    }

    // Prepare base family data common to all types
    const baseData: IFamilyFormPostBase = {
      title: formData.title,
      summary: stripHtml(formData.summary),
      geography: formData.geography?.value || '',
      category: isMCFCorpus ? 'MCF' : formData.category,
      corpus_import_id: formData.corpus?.value || '',
      collections:
        formData.collections?.map((collection) => collection.value) || [],
    }

    // Get the appropriate metadata handler & extract metadata
    const metadataHandler = getMetadataHandler(corpusInfo.corpus_type)
    const metadata = metadataHandler.extractMetadata(formData)

    // Create submission data using the specific handler
    const submissionData = metadataHandler.createSubmissionData(
      baseData,
      metadata,
    )

    try {
      if (loadedFamily) {
        await updateFamily(submissionData, loadedFamily.import_id)
        toast({
          title: 'Family has been successfully updated',
          status: 'success',
        })
      } else {
        const createResult = await createFamily(submissionData)
        toast({
          title: 'Family has been successfully created',
          status: 'success',
        })
        navigate(`/family/${createResult.response}/edit`)
      }
    } catch (error) {
      setFormError(error as IError)
      toast({
        title: `Family has not been ${loadedFamily ? 'updated' : 'created'}`,
        description: (error as IError).message,
        status: 'error',
      })
    } finally {
      setIsFormSubmitting(false)
    }
  }

  const onSubmit: SubmitHandler<TFamilyFormSubmit> = async (data) => {
    try {
      await handleFormSubmission(data)
    } catch (error) {
      console.log('onSubmitErrorHandler', error)
    }
  }

  // object type is workaround for SubmitErrorHandler<FieldErrors> throwing a tsc error.
  const onSubmitErrorHandler = (error: object) => {
    console.log('onSubmitErrorHandler', error)

    // Handle any submission errors
    setFormError(error as IError)
    toast({
      title: 'Form submission error',
      description: (error as IError).message,
      status: 'error',
    })
  }

  useEffect(() => {
    if (loadedFamily) {
      setFamilyDocuments(loadedFamily.documents || [])
      setFamilyEvents(loadedFamily.events || [])

      // Pre-set the form values to that of the loaded family
      reset({
        title: loadedFamily.title,
        summary: loadedFamily.summary,
        geography: {
          value: loadedFamily.geography,
          label:
            getCountries(config?.geographies)?.find(
              (country) => country.value === loadedFamily.geography,
            )?.display_value || loadedFamily.geography,
        },
        corpus: loadedFamily.corpus_import_id
          ? {
              label: loadedFamily.corpus_import_id,
              value: loadedFamily.corpus_import_id,
            }
          : undefined,
        category: isMCFCorpus ? 'MCF' : loadedFamily.category,
        collections: loadedFamily.collections?.map((collection) => ({
          value: collection,
          label: collection,
        })),
      })
    }
  }, [config, loadedFamily, reset, isMCFCorpus])

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
    })
    await deleteDocument(documentId)
      .then(() => {
        toast({
          title: 'Document has been successful deleted',
          status: 'success',
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

  const onEventDeleteClick = async (eventId: string) => {
    toast({
      title: 'Event deletion in progress',
      status: 'info',
    })
    await deleteEvent(eventId)
      .then(() => {
        toast({
          title: 'Event has been successfully deleted',
          status: 'success',
        })
        const index = familyEvents.indexOf(eventId)
        if (index > -1) {
          const newEvents = [...familyEvents]
          newEvents.splice(index, 1)
          setFamilyEvents(newEvents)
        }
        setUpdatedEvent(eventId)
      })
      .catch((error: IError) => {
        toast({
          title: 'Event has not been deleted',
          description: error.message,
          status: 'error',
        })
      })
  }

  const canLoadForm =
    !configLoading && !collectionsLoading && !configError && !collectionsError

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !isFormSubmitting &&
      Object.keys(dirtyFields).length > 0 &&
      currentLocation.pathname !== nextLocation.pathname,
  )

  useEffect(() => {
    if (blocker && blocker.state === 'blocked') {
      setIsLeavingModalOpen(true)
    }
  }, [blocker])

  useEffect(() => {
    return () => {
      window.removeEventListener('beforeunload', () => {})
    }
  }, [])

  return (
    <>
      {!canLoadForm && (
        <SkeletonText mt='4' noOfLines={12} spacing='4' skeletonHeight='2' />
      )}
      {!userAccess.canModify && (
        <ApiError
          message={`You do not have permission to edit document families in ${loadedFamily?.corpus_title || corpusInfo?.title} `}
          detail='Please go back to the "Families" page, if you think there has been a mistake please contact the administrator.'
        />
      )}
      {(configError || collectionsError || formError) && (
        <ApiError error={configError || collectionsError || formError} />
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
              isRequired={true}
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
                value: country.value,
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

            {!isMCFCorpus ? (
              <RadioGroupField
                name='category'
                label='Category'
                control={control}
                options={
                  // These are the global family categories. We set MCF as the category directly
                  // in the form above if the family corpus is a MCF corpus.
                  [
                    { value: 'Executive', label: 'Executive' },
                    { value: 'Legislative', label: 'Legislative' },
                    { value: 'UNFCCC', label: 'UNFCCC' },
                  ]
                }
                rules={{ required: true }}
              />
            ) : null}

            {corpusInfo && (
              <>
                <MetadataSection
                  corpusInfo={corpusInfo}
                  taxonomy={taxonomy}
                  control={control}
                  errors={errors}
                  loadedFamily={loadedFamily}
                  reset={reset}
                />
              </>
            )}

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
              onDelete={onEventDeleteClick}
              updatedEvent={updatedEvent}
              setUpdatedEvent={setUpdatedEvent}
              isNewFamily={!loadedFamily}
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
