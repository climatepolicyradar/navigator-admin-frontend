import { useEffect, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'

import {
  IError,
  TFamilyFormPost,
  TOrganisation,
  TFamilyFormPostMetadata,
  IUNFCCCMetadata,
  ICCLWMetadata,
  TFamily,
  IDocument,
} from '@/interfaces'
import { createFamily, updateFamily } from '@/api/Families'
import { deleteDocument } from '@/api/Documents'
import useConfig from '@/hooks/useConfig'

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
  Textarea,
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
} from '@chakra-ui/react'
import { Select as CRSelect, ChakraStylesConfig } from 'chakra-react-select'
import useCollections from '@/hooks/useCollections'
import { Loader } from '../Loader'
import { getCountries } from '@/utils/extractNestedGeographyData'
import { generateOptions } from '@/utils/generateOptions'
import { familySchema } from '@/schemas/familySchema'
import { DocumentForm } from './DocumentForm'
import { FamilyDocument } from '../family/FamilyDocument'
import { ApiError } from '../feedback/ApiError'

type TMultiSelect = {
  value: string
  label: string
}

interface IFamilyForm {
  title: string
  summary: string
  geography: string
  category: string
  organisation: string
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

const chakraStyles: ChakraStylesConfig = {
  container: (provided) => ({
    ...provided,
    background: 'white',
  }),
}

type TProps = {
  family?: TFamily
}

export const FamilyForm = ({ family: loadedFamily }: TProps) => {
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
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(familySchema),
  })
  const [editingDocument, setEditingDocument] = useState<
    IDocument | undefined
  >()
  const [familyDocuments, setFamilyDocuments] = useState<string[]>([])

  const watchOrganisation = watch('organisation')

  // Handlers
  const handleFormSubmission = async (family: IFamilyForm) => {
    setFormError(null)

    let familyMetadata = {} as TFamilyFormPostMetadata
    if (family.organisation === 'UNFCCC') {
      const metadata = familyMetadata as IUNFCCCMetadata
      if (family.author) metadata.author = [family.author]
      if (family.author_type) metadata.author_type = [family.author_type]
      familyMetadata = metadata
    } else if (family.organisation === 'CCLW') {
      const metadata = familyMetadata as ICCLWMetadata
      metadata.topic = family.topic?.map((topic) => topic.value) || []
      metadata.hazard = family.hazard?.map((hazard) => hazard.value) || []
      metadata.sector = family.sector?.map((sector) => sector.value) || []
      metadata.keyword = family.keyword?.map((keyword) => keyword.value) || []
      metadata.framework =
        family.framework?.map((framework) => framework.value) || []
      metadata.instrument =
        family.instrument?.map((instrument) => instrument.value) || []
      familyMetadata = metadata
    }

    // @ts-expect-error: TODO: fix this
    const familyData: TFamilyFormPost = {
      title: family.title,
      summary: family.summary,
      geography: family.geography,
      category: family.category,
      organisation: family.organisation as TOrganisation,
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
        navigate(`/family/${data.response.import_id}/edit`)
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
  } // end handleFormSubmission

  const handleAddNewDocumentClick = () => {
    setEditingDocument(undefined)
    onOpen()
  }

  const onSubmit: SubmitHandler<IFamilyForm> = (data) =>
    handleFormSubmission(data)

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

  const onDocumentFormEdit = (document: IDocument) => {
    setEditingDocument(document)
    onOpen()
  }

  const canLoadForm =
    !configLoading && !collectionsLoading && !configError && !collectionsError

  useEffect(() => {
    if (loadedFamily) {
      setFamilyDocuments(loadedFamily.documents)
      // set the form values to that of the loaded family
      reset({
        title: loadedFamily.title,
        summary: loadedFamily.summary,
        geography: loadedFamily.geography,
        category: loadedFamily.category,
        organisation: loadedFamily.organisation,
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
  }, [loadedFamily, reset])

  return (
    <>
      {(configLoading || collectionsLoading) && (
        <Box padding="4" bg="white">
          <Loader />
          <SkeletonText mt="4" noOfLines={12} spacing="4" skeletonHeight="2" />
        </Box>
      )}
      {configError && <ApiError error={configError} />}
      {collectionsError && <ApiError error={collectionsError} />}
      {(configError || collectionsError) && (
        <ApiError
          message="Please create a collection first"
          detail="You can do this by clicking the button below"
        />
      )}
      {canLoadForm && (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap="4" mb={12} align={'stretch'}>
              {formError && <ApiError error={formError} />}
              {loadedFamily && (
                <FormControl isRequired isReadOnly isDisabled>
                  <FormLabel>Import ID</FormLabel>
                  <Input bg="white" value={loadedFamily?.import_id} />
                </FormControl>
              )}
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input bg="white" {...register('title')} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Summary</FormLabel>
                <Textarea
                  height={'300px'}
                  bg="white"
                  {...register('summary')}
                />
              </FormControl>
              <Controller
                control={control}
                name="collections"
                render={({ field }) => {
                  return (
                    <FormControl>
                      <FormLabel>Collections</FormLabel>
                      <CRSelect
                        chakraStyles={chakraStyles}
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
                name="geography"
                render={({ field }) => {
                  return (
                    <FormControl
                      isRequired
                      as="fieldset"
                      isInvalid={!!errors.geography}
                    >
                      <FormLabel>Geography</FormLabel>
                      <Select background="white" {...field}>
                        <option value="">Please select</option>
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
              <Controller
                control={control}
                name="category"
                render={({ field }) => {
                  return (
                    <FormControl
                      isRequired
                      as="fieldset"
                      isInvalid={!!errors.category}
                    >
                      <FormLabel as="legend">Category</FormLabel>
                      <RadioGroup {...field}>
                        <HStack gap={4}>
                          <Radio bg="white" value="Executive">
                            Executive
                          </Radio>
                          <Radio bg="white" value="Legislative">
                            Legislative
                          </Radio>
                          <Radio bg="white" value="Litigation">
                            Litigation
                          </Radio>
                          <Radio bg="white" value="UNFCCC">
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
              <Controller
                control={control}
                name="organisation"
                render={({ field }) => {
                  return (
                    <FormControl
                      isRequired
                      as="fieldset"
                      isInvalid={!!errors.organisation}
                    >
                      <FormLabel as="legend">Organisation</FormLabel>
                      <RadioGroup {...field}>
                        <HStack gap={4}>
                          <Radio bg="white" value="CCLW">
                            CCLW
                          </Radio>
                          <Radio bg="white" value="UNFCCC">
                            UNFCCC
                          </Radio>
                        </HStack>
                      </RadioGroup>
                      <FormErrorMessage>
                        Please select an organisation
                      </FormErrorMessage>
                    </FormControl>
                  )
                }}
              />
              {!!watchOrganisation && (
                <Box position="relative" padding="10">
                  <Divider />
                  <AbsoluteCenter bg="gray.50" px="4">
                    Metadata
                  </AbsoluteCenter>
                </Box>
              )}
              {watchOrganisation === 'UNFCCC' && (
                <>
                  <FormControl isRequired>
                    <FormLabel>Author</FormLabel>
                    <Input bg="white" {...register('author')} />
                  </FormControl>
                  <Controller
                    control={control}
                    name="author_type"
                    render={({ field }) => {
                      return (
                        <FormControl
                          isRequired
                          as="fieldset"
                          isInvalid={!!errors.author_type}
                        >
                          <FormLabel as="legend">Author type</FormLabel>
                          <RadioGroup {...field}>
                            <HStack gap={4}>
                              {config?.taxonomies.UNFCCC.author_type.allowed_values.map(
                                (authorType) => (
                                  <Radio
                                    bg="white"
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
              {watchOrganisation === 'CCLW' && (
                <>
                  <Controller
                    control={control}
                    name="topic"
                    render={({ field }) => {
                      return (
                        <FormControl>
                          <FormLabel>Topics</FormLabel>
                          <CRSelect
                            chakraStyles={chakraStyles}
                            isClearable={false}
                            isMulti={true}
                            isSearchable={true}
                            options={generateOptions(
                              config?.taxonomies.CCLW.topic.allowed_values,
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
                    name="hazard"
                    render={({ field }) => {
                      return (
                        <FormControl>
                          <FormLabel>Hazards</FormLabel>
                          <CRSelect
                            chakraStyles={chakraStyles}
                            isClearable={false}
                            isMulti={true}
                            isSearchable={true}
                            options={generateOptions(
                              config?.taxonomies.CCLW.hazard.allowed_values,
                            )}
                            {...field}
                          />
                        </FormControl>
                      )
                    }}
                  />
                  <Controller
                    control={control}
                    name="sector"
                    render={({ field }) => {
                      return (
                        <FormControl>
                          <FormLabel>Sectors</FormLabel>
                          <CRSelect
                            chakraStyles={chakraStyles}
                            isClearable={false}
                            isMulti={true}
                            isSearchable={true}
                            options={generateOptions(
                              config?.taxonomies.CCLW.sector.allowed_values,
                            )}
                            {...field}
                          />
                        </FormControl>
                      )
                    }}
                  />
                  <Controller
                    control={control}
                    name="keyword"
                    render={({ field }) => {
                      return (
                        <FormControl>
                          <FormLabel>Keywords</FormLabel>
                          <CRSelect
                            chakraStyles={chakraStyles}
                            isClearable={false}
                            isMulti={true}
                            isSearchable={true}
                            options={generateOptions(
                              config?.taxonomies.CCLW.keyword.allowed_values,
                            )}
                            {...field}
                          />
                        </FormControl>
                      )
                    }}
                  />
                  <Controller
                    control={control}
                    name="framework"
                    render={({ field }) => {
                      return (
                        <FormControl>
                          <FormLabel>Frameworks</FormLabel>
                          <CRSelect
                            chakraStyles={chakraStyles}
                            isClearable={false}
                            isMulti={true}
                            isSearchable={true}
                            options={generateOptions(
                              config?.taxonomies.CCLW.framework.allowed_values,
                            )}
                            {...field}
                          />
                        </FormControl>
                      )
                    }}
                  />
                  <Controller
                    control={control}
                    name="instrument"
                    render={({ field }) => {
                      return (
                        <FormControl>
                          <FormLabel>Instruments</FormLabel>
                          <CRSelect
                            chakraStyles={chakraStyles}
                            isClearable={false}
                            isMulti={true}
                            isSearchable={true}
                            options={generateOptions(
                              config?.taxonomies.CCLW.instrument.allowed_values,
                            )}
                            {...field}
                          />
                        </FormControl>
                      )
                    }}
                  />
                </>
              )}
              <Box position="relative" padding="10">
                <Divider />
                <AbsoluteCenter bg="gray.50" px="4">
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
                <>
                  <Flex direction="column" gap={4}>
                    {familyDocuments.map((familyDoc) => (
                      <FamilyDocument
                        documentId={familyDoc}
                        key={familyDoc}
                        onEdit={onDocumentFormEdit}
                        onDelete={onDocumentDeleteClick}
                      />
                    ))}
                  </Flex>
                  <Box>
                    <Button onClick={handleAddNewDocumentClick}>
                      Add new Document
                    </Button>
                  </Box>
                </>
              )}
            </VStack>

            <ButtonGroup>
              <Button
                type="submit"
                colorScheme="blue"
                onSubmit={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {(loadedFamily ? 'Update ' : 'Create new ') + ' Family'}
              </Button>
            </ButtonGroup>
          </form>
          <Drawer placement="right" onClose={onClose} isOpen={isOpen} size="lg">
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px">
                Add new Document
              </DrawerHeader>
              <DrawerBody>
                <DocumentForm
                  familyId={loadedFamily?.import_id}
                  onSuccess={onDocumentFormSuccess}
                  document={editingDocument}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </>
  )
}
