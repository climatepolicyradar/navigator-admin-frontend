import { useEffect, useState, useMemo, useCallback } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useBlocker, useNavigate } from 'react-router-dom'

import {
  IError,
  TFamilyFormPost,
  TFamilyFormPostMetadata,
  IUNFCCCMetadata,
  ICCLWMetadata,
  TFamily,
  IDocument,
  IEvent,
  ICollection,
  IConfigCorpus,
  IConfigTaxonomyUNFCCC,
  IConfigTaxonomyCCLW,
  IDecodedToken,
} from '@/interfaces'
import { createFamily, updateFamily } from '@/api/Families'
import { deleteDocument } from '@/api/Documents'
import useConfig from '@/hooks/useConfig'
import { canModify } from '@/utils/canModify'

import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Select,
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
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { Select as CRSelect } from 'chakra-react-select'
import useCollections from '@/hooks/useCollections'
import { Loader } from '../Loader'
import { getCountries } from '@/utils/extractNestedGeographyData'
import { generateOptions } from '@/utils/generateOptions'
import { familySchema } from '@/schemas/familySchema'
import { DocumentForm } from './DocumentForm'
import { FamilyDocument } from '../family/FamilyDocument'
import { ApiError } from '../feedback/ApiError'
import { FamilyEvent } from '../family/FamilyEvent'
import { deleteEvent } from '@/api/Events'
import { EventForm } from './EventForm'
import { formatDate } from '@/utils/formatDate'
import { WYSIWYG } from '../form-components/WYSIWYG'
import { decodeToken } from '@/utils/decodeToken'
import { chakraStylesSelect } from '@/styles/chakra'
import { WarningIcon } from '@chakra-ui/icons'

type TMultiSelect = {
  value: string
  label: string
}

interface IFamilyForm {
  title: string
  summary: string
  geography: string
  category: string
  corpus: IConfigCorpus
  collections?: TMultiSelect[]
  author?: string
  author_type?: string
  topic?: TMultiSelect[]
  hazard?: TMultiSelect[]
  sector?: TMultiSelect[]
  keyword?: TMultiSelect[]
  framework?: TMultiSelect[]
  instrument?: TMultiSelect[]
}

type TChildEntity = 'document' | 'event'

type TProps = {
  family?: TFamily
}

const getCollection = (collectionId: string, collections: ICollection[]) => {
  return collections.find((collection) => collection.import_id === collectionId)
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
  const {
    register,
    watch,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    formState: { dirtyFields },
  } = useForm({
    resolver: yupResolver(familySchema),
  })
  const [editingEntity, setEditingEntity] = useState<TChildEntity | undefined>()
  const [editingEvent, setEditingEvent] = useState<IEvent | undefined>()
  const [editingDocument, setEditingDocument] = useState<
    IDocument | undefined
  >()
  const [familyDocuments, setFamilyDocuments] = useState<string[]>([])
  const [familyEvents, setFamilyEvents] = useState<string[]>([])

  const watchCorpus = watch('corpus')
  const corpusInfo = useMemo(() => {
    const getCorpusFromId = (corpusId: string) => {
      const corp = config?.corpora.find(
        (corpus) => corpus.corpus_import_id === corpusId,
      )
      return corp ? corp : null
    }

    if (loadedFamily) {
      return getCorpusFromId(loadedFamily?.corpus_import_id)
    } else if (watchCorpus) {
      return getCorpusFromId(watchCorpus?.value)
    }
    return null
  }, [config?.corpora, loadedFamily, watchCorpus])

  const corpusTitle = loadedFamily
    ? loadedFamily?.corpus_title
    : corpusInfo?.title

  const taxonomy = useMemo(() => {
    if (corpusInfo?.corpus_type === 'Law and Policies')
      return corpusInfo?.taxonomy as IConfigTaxonomyCCLW
    else if (corpusInfo?.corpus_type === 'Intl. agreements')
      return corpusInfo?.taxonomy as IConfigTaxonomyUNFCCC
    else return corpusInfo?.taxonomy
  }, [corpusInfo])

  const userToken = useMemo(() => {
    const token = localStorage.getItem('token')
    if (!token) return null
    const decodedToken: IDecodedToken | null = decodeToken(token)
    return decodedToken
  }, [])

  const userAccess = !userToken ? null : userToken.authorisation
  const isSuperUser = !userToken ? false : userToken.is_superuser

  // TODO: Get org_id from corpus PDCT-1171.
  const orgName = loadedFamily ? String(loadedFamily?.organisation) : null

  // Family handlers
  const handleFormSubmission = async (family: IFamilyForm) => {
    setIsFormSubmitting(true)
    setFormError(null)

    let familyMetadata = {} as TFamilyFormPostMetadata
    if (corpusInfo?.corpus_type == 'Intl. agreements') {
      const metadata = familyMetadata as IUNFCCCMetadata
      if (family.author) metadata.author = [family.author]
      if (family.author_type) metadata.author_type = [family.author_type]
      metadata.event_type = []
      familyMetadata = metadata
    } else if (corpusInfo?.corpus_type == 'Laws and Policies') {
      const metadata: ICCLWMetadata = {
        topic: family.topic?.map((topic) => topic.value) || [],
        hazard: family.hazard?.map((hazard) => hazard.value) || [],
        sector: family.sector?.map((sector) => sector.value) || [],
        keyword: family.keyword?.map((keyword) => keyword.value) || [],
        framework: family.framework?.map((framework) => framework.value) || [],
        instrument:
          family.instrument?.map((instrument) => instrument.value) || [],
        event_type: [],
      }
      familyMetadata = metadata
    }

    // @ts-expect-error: TODO: fix this
    const familyData: TFamilyFormPost = {
      title: family.title,
      summary: family.summary,
      geography: family.geography,
      category: family.category,
      corpus_import_id: family.corpus?.value || '',
      collections:
        family.collections?.map((collection) => collection.value) || [],
      metadata: familyMetadata,
    }

    if (loadedFamily) {
      return await updateFamily(familyData, loadedFamily.import_id)
        .then(() => {
          toast.closeAll()
          toast({
            title: 'Family has been successfully updated',
            status: 'success',
            position: 'top',
          })
        })
        .catch((error: IError) => {
          setFormError(error)
          toast({
            title: 'Family has not been updated',
            description: error.message,
            status: 'error',
            position: 'top',
          })
        })
    }

    return await createFamily(familyData)
      .then((data) => {
        toast.closeAll()
        toast({
          title: 'Family has been successfully created',
          status: 'success',
          position: 'top',
        })
        navigate(`/family/${data.response}/edit`)
      })
      .catch((error: IError) => {
        setFormError(error)
        toast({
          title: 'Family has not been created',
          description: error.message,
          status: 'error',
          position: 'top',
        })
      })
      .finally(() => {
        setIsFormSubmitting(false)
      })
  } // end handleFormSubmission

  const onSubmit: SubmitHandler<IFamilyForm> = (data) => {
    handleFormSubmission(data).catch((error: IError) => {
      console.error(error)
    })
  }

  // object type is workaround for SubmitErrorHandler<FieldErrors> throwing a tsc error.
  const onSubmitErrorHandler = (error: object) => {
    console.log('onSubmitErrorHandler', error)
  }

  // Child entity handlers
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

  // Document handlers
  const onDocumentFormSuccess = (documentId: string) => {
    onClose()
    if (familyDocuments.includes(documentId))
      setFamilyDocuments([...familyDocuments])
    else setFamilyDocuments([...familyDocuments, documentId])
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
    setValue('summary', html, { shouldDirty: true })
  }

  // Event handlers
  const onEventFormSuccess = (eventId: string) => {
    onClose()
    if (familyEvents.includes(eventId)) setFamilyEvents([...familyEvents])
    else setFamilyEvents([...familyEvents, eventId])
  }

  const onEventDeleteClick = async (eventId: string) => {
    toast({
      title: 'Event deletion in progress',
      status: 'info',
      position: 'top',
    })
    await deleteEvent(eventId)
      .then(() => {
        toast({
          title: 'Document has been successful deleted',
          status: 'success',
          position: 'top',
        })
        const index = familyEvents.indexOf(eventId)
        if (index > -1) {
          const newEvents = [...familyEvents]
          newEvents.splice(index, 1)
          setFamilyEvents(newEvents)
        }
      })
      .catch((error: IError) => {
        toast({
          title: 'Event has not been deleted',
          description: error.message,
          status: 'error',
          position: 'top',
        })
      })
  }

  const canLoadForm =
    !configLoading && !collectionsLoading && !configError && !collectionsError

  useEffect(() => {
    if (loadedFamily) {
      setFamilyDocuments(loadedFamily.documents)
      setFamilyEvents(loadedFamily.events)
      // set the form values to that of the loaded family
      reset({
        title: loadedFamily.title,
        summary: loadedFamily.summary,
        collections: loadedFamily.collections.map((collectionId) => {
          const collection = getCollection(collectionId, collections)
          if (!collection) return null
          return {
            value: collection.import_id,
            label: collection.title,
          }
        }),
        geography: loadedFamily.geography,
        category: loadedFamily.category,
        corpus: loadedFamily.corpus_import_id
          ? {
              label: loadedFamily.corpus_import_id,
              value: loadedFamily.corpus_import_id,
            }
          : undefined,
        topic:
          'topic' in loadedFamily.metadata
            ? generateOptions(loadedFamily.metadata.topic)
            : [],
        hazard:
          'hazard' in loadedFamily.metadata
            ? generateOptions(loadedFamily.metadata.hazard)
            : [],
        sector:
          'sector' in loadedFamily.metadata
            ? generateOptions(loadedFamily.metadata.sector)
            : [],
        keyword:
          'keyword' in loadedFamily.metadata
            ? generateOptions(loadedFamily.metadata.keyword)
            : [],
        framework:
          'framework' in loadedFamily.metadata
            ? generateOptions(loadedFamily.metadata.framework)
            : [],
        instrument:
          'instrument' in loadedFamily.metadata
            ? generateOptions(loadedFamily.metadata.instrument)
            : [],
        author:
          'author' in loadedFamily.metadata
            ? loadedFamily.metadata.author[0]
            : '',
        author_type:
          'author_type' in loadedFamily.metadata
            ? loadedFamily.metadata.author_type[0]
            : '',
      })
    }
  }, [loadedFamily, collections, reset])

  // Internal and external navigation blocker for unsaved changes
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
      {(configLoading || collectionsLoading) && (
        <Box padding='4' bg='white'>
          <Loader />
          <SkeletonText mt='4' noOfLines={12} spacing='4' skeletonHeight='2' />
        </Box>
      )}
      {!canModify(orgName, isSuperUser, userAccess) && (
        <ApiError
          message={`You do not have permission to edit document families in ${corpusTitle} `}
          detail='Please go back to the "Families" page, if you think there has been a mistake please contact the administrator.'
        />
      )}
      {configError && <ApiError error={configError} />}
      {collectionsError && <ApiError error={collectionsError} />}
      {(configError || collectionsError) && (
        <ApiError
          message='Please create a collection first'
          detail='You can do this by clicking the button below'
        />
      )}
      {canLoadForm && (
        <>
          {isLeavingModalOpen && (
            <Modal
              isOpen={isLeavingModalOpen}
              onClose={() => setIsLeavingModalOpen(false)}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Are you sure you want to leave?</ModalHeader>
                <ModalCloseButton />
                <ModalBody>Changes that you made may not be saved.</ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme='gray'
                    mr={3}
                    onClick={() => setIsLeavingModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme='red'
                    onClick={() => {
                      blocker.proceed?.()
                      setIsLeavingModalOpen(false)
                    }}
                  >
                    Leave without saving
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
          <form onSubmit={handleSubmit(onSubmit, onSubmitErrorHandler)}>
            <VStack gap='4' mb={12} mt={4} align={'stretch'}>
              {formError && <ApiError error={formError} />}
              {loadedFamily && (
                <>
                  <FormControl isRequired isReadOnly isDisabled>
                    <FormLabel>Import ID</FormLabel>
                    <Input
                      data-test-id='input-id'
                      bg='white'
                      value={loadedFamily?.import_id}
                    />
                  </FormControl>
                  <FormControl isRequired isReadOnly isDisabled>
                    <FormLabel>Corpus ID</FormLabel>
                    <Input
                      data-test-id='corpus-id'
                      bg='white'
                      value={loadedFamily?.corpus_import_id}
                    />
                  </FormControl>

                  <FormControl isRequired isReadOnly isDisabled>
                    <FormLabel>Corpus Title</FormLabel>
                    <Input
                      data-test-id='corpus-title'
                      bg='white'
                      value={loadedFamily?.corpus_title}
                    />
                  </FormControl>
                  <FormControl isRequired isReadOnly isDisabled>
                    <FormLabel>Corpus Type</FormLabel>
                    <Input
                      data-test-id='corpus-type'
                      bg='white'
                      value={loadedFamily?.corpus_type}
                    />
                  </FormControl>
                </>
              )}
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input bg='white' {...register('title')} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Summary</FormLabel>
                <WYSIWYG
                  html={loadedFamily?.summary}
                  onChange={summaryOnChange}
                />
              </FormControl>
              <Controller
                control={control}
                name='collections'
                render={({ field }) => {
                  return (
                    <FormControl>
                      <FormLabel>Collections</FormLabel>
                      <CRSelect
                        chakraStyles={chakraStylesSelect}
                        isClearable={false}
                        isMulti={true}
                        isSearchable={true}
                        options={
                          collections?.map((collection) => ({
                            value: collection.import_id,
                            label: collection.title,
                          })) || []
                        }
                        {...field}
                      />
                    </FormControl>
                  )
                }}
              />
              <Controller
                control={control}
                name='geography'
                render={({ field }) => {
                  return (
                    <FormControl
                      isRequired
                      as='fieldset'
                      isInvalid={!!errors.geography}
                    >
                      <FormLabel>Geography</FormLabel>
                      <Select background='white' {...field}>
                        <option value=''>Please select</option>
                        {getCountries(config?.geographies).map((country) => (
                          <option key={country.id} value={country.value}>
                            {country.display_value}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  )
                }}
              />
              {!loadedFamily && (
                <Controller
                  control={control}
                  data-test-id='corpus'
                  name='corpus'
                  render={({ field }) => {
                    return (
                      <FormControl isRequired>
                        <FormLabel>Corpus</FormLabel>
                        <CRSelect
                          chakraStyles={chakraStylesSelect}
                          isClearable={false}
                          isMulti={false}
                          isSearchable={true}
                          options={
                            config?.corpora.map((corpus) => ({
                              value: corpus.corpus_import_id,
                              label: corpus.title,
                            })) || []
                          }
                          {...field}
                        />
                      </FormControl>
                    )
                  }}
                />
              )}
              <Controller
                control={control}
                name='category'
                render={({ field }) => {
                  return (
                    <FormControl
                      isRequired
                      as='fieldset'
                      isInvalid={!!errors.category}
                    >
                      <FormLabel as='legend'>Category</FormLabel>
                      <RadioGroup {...field}>
                        <HStack gap={4}>
                          <Radio bg='white' value='Executive'>
                            Executive
                          </Radio>
                          <Radio bg='white' value='Legislative'>
                            Legislative
                          </Radio>
                          <Radio bg='white' value='Litigation'>
                            Litigation
                          </Radio>
                          <Radio bg='white' value='UNFCCC'>
                            UNFCCC
                          </Radio>
                        </HStack>
                      </RadioGroup>
                      <FormErrorMessage>
                        Please select a category
                      </FormErrorMessage>
                    </FormControl>
                  )
                }}
              />
              {corpusInfo !== null && (
                <Box position='relative' padding='10'>
                  <Divider />
                  <AbsoluteCenter bg='gray.50' px='4'>
                    Metadata
                  </AbsoluteCenter>
                </Box>
              )}
              {corpusInfo !== null &&
                corpusInfo?.corpus_type === 'Intl. agreements' && (
                  <>
                    <FormControl isRequired>
                      <FormLabel>Author</FormLabel>
                      <Input bg='white' {...register('author')} />
                    </FormControl>
                    <Controller
                      control={control}
                      name='author_type'
                      render={({ field }) => {
                        const tax = taxonomy as IConfigTaxonomyUNFCCC
                        return (
                          <FormControl
                            isRequired
                            as='fieldset'
                            isInvalid={!!errors.author_type}
                          >
                            <FormLabel as='legend'>Author type</FormLabel>
                            <RadioGroup {...field}>
                              <HStack gap={4}>
                                {tax?.author_type.allowed_values.map(
                                  (authorType) => (
                                    <Radio
                                      bg='white'
                                      value={authorType}
                                      key={authorType}
                                    >
                                      {authorType}
                                    </Radio>
                                  ),
                                )}
                              </HStack>
                            </RadioGroup>
                            <FormErrorMessage>
                              Please select an author type
                            </FormErrorMessage>
                          </FormControl>
                        )
                      }}
                    />
                  </>
                )}
              {corpusInfo !== null &&
                corpusInfo?.corpus_type === 'Laws and Policies' && (
                  <>
                    <Controller
                      control={control}
                      name='topic'
                      render={({ field }) => {
                        const tax = taxonomy as IConfigTaxonomyCCLW
                        return (
                          <FormControl>
                            <FormLabel>Topics</FormLabel>
                            <CRSelect
                              chakraStyles={chakraStylesSelect}
                              isClearable={false}
                              isMulti={true}
                              isSearchable={true}
                              options={generateOptions(
                                tax?.topic.allowed_values || [],
                              )}
                              {...field}
                            />

                            <FormHelperText>
                              You are able to search and can select multiple
                              options.
                            </FormHelperText>
                          </FormControl>
                        )
                      }}
                    />
                    <Controller
                      control={control}
                      name='hazard'
                      render={({ field }) => {
                        const tax = taxonomy as IConfigTaxonomyCCLW
                        return (
                          <FormControl>
                            <FormLabel>Hazards</FormLabel>
                            <CRSelect
                              chakraStyles={chakraStylesSelect}
                              isClearable={false}
                              isMulti={true}
                              isSearchable={true}
                              options={generateOptions(
                                tax?.hazard.allowed_values || [],
                              )}
                              {...field}
                            />
                          </FormControl>
                        )
                      }}
                    />
                    <Controller
                      control={control}
                      name='sector'
                      render={({ field }) => {
                        const tax = taxonomy as IConfigTaxonomyCCLW
                        return (
                          <FormControl>
                            <FormLabel>Sectors</FormLabel>
                            <CRSelect
                              chakraStyles={chakraStylesSelect}
                              isClearable={false}
                              isMulti={true}
                              isSearchable={true}
                              options={generateOptions(
                                tax?.sector.allowed_values || [],
                              )}
                              {...field}
                            />
                          </FormControl>
                        )
                      }}
                    />
                    <Controller
                      control={control}
                      name='keyword'
                      render={({ field }) => {
                        const tax = taxonomy as IConfigTaxonomyCCLW
                        return (
                          <FormControl>
                            <FormLabel>Keywords</FormLabel>
                            <CRSelect
                              chakraStyles={chakraStylesSelect}
                              isClearable={false}
                              isMulti={true}
                              isSearchable={true}
                              options={generateOptions(
                                tax?.keyword.allowed_values || [],
                              )}
                              {...field}
                            />
                          </FormControl>
                        )
                      }}
                    />
                    <Controller
                      control={control}
                      name='framework'
                      render={({ field }) => {
                        const tax = taxonomy as IConfigTaxonomyCCLW
                        return (
                          <FormControl>
                            <FormLabel>Frameworks</FormLabel>
                            <CRSelect
                              chakraStyles={chakraStylesSelect}
                              isClearable={false}
                              isMulti={true}
                              isSearchable={true}
                              options={generateOptions(
                                tax?.framework.allowed_values || [],
                              )}
                              {...field}
                            />
                          </FormControl>
                        )
                      }}
                    />
                    <Controller
                      control={control}
                      name='instrument'
                      render={({ field }) => {
                        const tax = taxonomy as IConfigTaxonomyCCLW
                        return (
                          <FormControl>
                            <FormLabel>Instruments</FormLabel>
                            <CRSelect
                              chakraStyles={chakraStylesSelect}
                              isClearable={false}
                              isMulti={true}
                              isSearchable={true}
                              options={generateOptions(
                                tax?.instrument.allowed_values || [],
                              )}
                              {...field}
                            />
                          </FormControl>
                        )
                      }}
                    />
                  </>
                )}
              <Box position='relative' padding='10'>
                <Divider />
                <AbsoluteCenter bg='gray.50' px='4'>
                  Documents
                </AbsoluteCenter>
              </Box>
              {!loadedFamily && (
                <Text>
                  Please create the family first before attempting to add
                  documents
                </Text>
              )}
              {familyDocuments.length && (
                <Flex direction='column' gap={4}>
                  {familyDocuments.map((familyDoc) => (
                    <FamilyDocument
                      canModify={canModify(orgName, isSuperUser, userAccess)}
                      documentId={familyDoc}
                      key={familyDoc}
                      onEditClick={(id) => onEditEntityClick('document', id)}
                      onDeleteClick={onDocumentDeleteClick}
                    />
                  ))}
                </Flex>
              )}
              {loadedFamily && (
                <Box>
                  <Button
                    isDisabled={
                      !canModify(
                        loadedFamily?.organisation,
                        isSuperUser,
                        userAccess,
                      )
                    }
                    onClick={() => onAddNewEntityClick('document')}
                    rightIcon={
                      familyDocuments.length === 0 ? (
                        <WarningIcon
                          color='red.500'
                          data-test-id='warning-icon-document'
                        />
                      ) : undefined
                    }
                  >
                    Add new Document
                  </Button>
                </Box>
              )}
              <Box position='relative' padding='10'>
                <Divider />
                <AbsoluteCenter bg='gray.50' px='4'>
                  Events
                </AbsoluteCenter>
              </Box>
              {!loadedFamily && (
                <Text>
                  Please create the family first before attempting to add events
                </Text>
              )}
              {familyEvents.length && (
                <Flex direction='column' gap={4}>
                  {familyEvents.map((familyEvent) => (
                    <FamilyEvent
                      canModify={canModify(orgName, isSuperUser, userAccess)}
                      eventId={familyEvent}
                      key={familyEvent}
                      onEditClick={(event) => onEditEntityClick('event', event)}
                      onDeleteClick={onEventDeleteClick}
                    />
                  ))}
                </Flex>
              )}
              {loadedFamily && (
                <Box>
                  <Button
                    isDisabled={
                      !canModify(
                        loadedFamily?.organisation,
                        isSuperUser,
                        userAccess,
                      )
                    }
                    onClick={() => onAddNewEntityClick('event')}
                    rightIcon={
                      familyEvents.length === 0 ? (
                        <WarningIcon
                          color='red.500'
                          data-test-id='warning-icon-event'
                        />
                      ) : undefined
                    }
                  >
                    Add new Event
                  </Button>
                </Box>
              )}
            </VStack>

            <ButtonGroup
              isDisabled={
                !canModify(
                  loadedFamily?.organisation || orgName,
                  isSuperUser,
                  userAccess,
                )
              }
            >
              <Button
                type='submit'
                colorScheme='blue'
                onSubmit={handleSubmit(onSubmit, onSubmitErrorHandler)}
                disabled={isSubmitting}
              >
                {(loadedFamily ? 'Update ' : 'Create new ') + ' Family'}
              </Button>
            </ButtonGroup>
          </form>
          <Drawer placement='right' onClose={onClose} isOpen={isOpen} size='lg'>
            <DrawerOverlay />
            {editingEntity === 'document' && loadedFamily && (
              <DrawerContent>
                <DrawerHeader borderBottomWidth='1px'>
                  {editingDocument
                    ? `Edit: ${editingDocument.title}`
                    : 'Add new Document'}
                </DrawerHeader>
                <DrawerBody>
                  <DocumentForm
                    familyId={loadedFamily.import_id}
                    canModify={canModify(
                      loadedFamily?.organisation,
                      isSuperUser,
                      userAccess,
                    )}
                    onSuccess={onDocumentFormSuccess}
                    document={editingDocument}
                  />
                </DrawerBody>
              </DrawerContent>
            )}
            {editingEntity === 'event' && loadedFamily && (
              <DrawerContent>
                <DrawerHeader borderBottomWidth='1px'>
                  {editingEvent
                    ? `Edit: ${editingEvent.event_title}, on ${formatDate(editingEvent.date)}`
                    : 'Add new Event'}
                </DrawerHeader>
                <DrawerBody>
                  <EventForm
                    familyId={loadedFamily.import_id}
                    canModify={canModify(
                      loadedFamily?.organisation,
                      isSuperUser,
                      userAccess,
                    )}
                    taxonomy={taxonomy}
                    onSuccess={onEventFormSuccess}
                    event={editingEvent}
                  />
                </DrawerBody>
              </DrawerContent>
            )}
          </Drawer>
        </>
      )}
    </>
  )
}
