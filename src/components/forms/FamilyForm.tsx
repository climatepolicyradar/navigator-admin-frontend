import { useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import {
  IError,
  TFamilyFormPost,
  TOrganisation,
  TFamilyFormPostMetadata,
  IUNFCCCMetadata,
  ICCLWMetadata,
} from '@/interfaces'
import { createFamily } from '@/api/Families'
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
} from '@chakra-ui/react'
import { Select as CRSelect, ChakraStylesConfig } from 'chakra-react-select'
import useCollections from '@/hooks/useCollections'
import { Loader } from '../Loader'
import { getCountries } from '@/utils/extractNestedGeographyData'

type TMultiSelect = {
  value: string
  label: string
}

interface IFamilyForm {
  import_id: string
  title: string
  summary: string
  geography: string
  category: string
  organisation: string
  author?: string
  author_type?: string
  topic?: TMultiSelect[]
  hazard?: TMultiSelect[]
  sector?: TMultiSelect[]
  keyword?: TMultiSelect[]
  framework?: TMultiSelect[]
  instrument?: TMultiSelect[]
}

const schema = yup
  .object({
    import_id: yup.string().required(),
    title: yup.string().required(),
    summary: yup.string().required(),
    geography: yup.string().required(),
    category: yup.string().required(),
    organisation: yup.string().required(),
    author: yup.string().when('organisation', {
      is: 'UNFCCC',
      then: (schema) => schema.required(),
    }),
    author_type: yup.string().when('organisation', {
      is: 'UNFCCC',
      then: (schema) => schema.required(),
    }),
    topic: yup.array().optional(),
    hazard: yup.array().optional(),
    sector: yup.array().optional(),
    keyword: yup.array().optional(),
    framework: yup.array().optional(),
    instrument: yup.array().optional(),
  })
  .required()

const generateOptions = (values?: string[]) => {
  return values?.map((value) => ({ value, label: value })) || []
}

const chakraStyles: ChakraStylesConfig = {
  container: (provided) => ({
    ...provided,
    background: 'white',
  }),
}

export const FamilyForm = () => {
  const { config, error: configError, loading: configLoading } = useConfig()
  const {
    collections,
    error: collectionsError,
    loading: collectionsLoading,
  } = useCollections()

  const toast = useToast()
  const [formError, setFormError] = useState<IError | null | undefined>()
  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const watchOrganisation = watch('organisation')

  const handleFamilyCreate = async (family: IFamilyForm) => {
    setFormError(null)

    console.log('handleFamilyCreate, IFamilyForm: ', family)

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
      import_id: family.import_id,
      title: family.title,
      summary: family.summary,
      geography: family.geography,
      category: family.category,
      organisation: family.organisation as TOrganisation,
      metadata: familyMetadata,
    }

    await createFamily(familyData)
      .then(() => {
        toast.closeAll()
        toast({
          title: 'Family has been successfully created',
          status: 'success',
          position: 'top',
        })
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
  }

  const onSubmit: SubmitHandler<IFamilyForm> = (data) =>
    handleFamilyCreate(data)

  const canLoadForm =
    !configLoading && !collectionsLoading && !configError && !collectionsError

  return (
    <>
      {(configLoading || collectionsLoading) && (
        <Box padding="4" bg="white">
          <Loader />
          <SkeletonText mt="4" noOfLines={12} spacing="4" skeletonHeight="2" />
        </Box>
      )}
      {configError && (
        <Box padding="4" bg="white">
          <Text color={'red.500'}>{configError.message}</Text>
          <Text fontSize="xs" color={'gray.500'}>
            {configError.detail}
          </Text>
        </Box>
      )}
      {collectionsError && (
        <Box padding="4" bg="white">
          <Text color={'red.500'}>{collectionsError.message}</Text>
          <Text fontSize="xs" color={'gray.500'}>
            {collectionsError.detail}
          </Text>
        </Box>
      )}
      {(configError || collectionsError) && (
        <Box padding="4" bg="white">
          <Text color={'red.500'}>Please create a collection first</Text>
          <Text fontSize="xs" color={'gray.500'}>
            You can do this by clicking the button below
          </Text>
        </Box>
      )}
      {canLoadForm && (
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
            <FormControl isRequired>
              <FormLabel>Import ID</FormLabel>
              <Input bg="white" {...register('import_id')} />
              <FormHelperText>
                Must be in the format of: a.b.c.d where each letter represents a
                word or number for example: CCLW.family.1234.5678
              </FormHelperText>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input bg="white" {...register('title')} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Summary</FormLabel>
              <Textarea height={'300px'} bg="white" {...register('summary')} />
            </FormControl>
            <FormControl>
              <FormLabel>Collection</FormLabel>
              <Select background="white">
                <option value="">Please select</option>
                {collections?.map((collection) => (
                  <option
                    key={collection.import_id}
                    value={collection.import_id}
                  >
                    {collection.title}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Geography</FormLabel>
              <Select background="white" {...register('geography')}>
                <option value="">Please select</option>
                {getCountries(config?.geographies).map((country) => (
                  <option key={country.id} value={country.value}>
                    {country.display_value}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired as="fieldset" isInvalid={!!errors.category}>
              <FormLabel as="legend">Category</FormLabel>
              <RadioGroup>
                <HStack gap={4}>
                  <Radio bg="white" value="Executive" {...register('category')}>
                    Executive
                  </Radio>
                  <Radio
                    bg="white"
                    value="Legislative"
                    {...register('category')}
                  >
                    Legislative
                  </Radio>
                  <Radio
                    bg="white"
                    value="Litigation"
                    {...register('category')}
                  >
                    Litigation
                  </Radio>
                  <Radio bg="white" value="UNFCCC" {...register('category')}>
                    UNFCCC
                  </Radio>
                </HStack>
              </RadioGroup>
              <FormErrorMessage>Please select a category</FormErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              as="fieldset"
              isInvalid={!!errors.organisation}
            >
              <FormLabel as="legend">Organisation</FormLabel>
              <RadioGroup>
                <HStack gap={4}>
                  <Radio bg="white" value="CCLW" {...register('organisation')}>
                    CCLW
                  </Radio>
                  <Radio
                    bg="white"
                    value="UNFCCC"
                    {...register('organisation')}
                  >
                    UNFCCC
                  </Radio>
                </HStack>
              </RadioGroup>
              <FormErrorMessage>Please select an organisation</FormErrorMessage>
            </FormControl>
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
                <FormControl
                  isRequired
                  as="fieldset"
                  isInvalid={!!errors.author_type}
                >
                  <FormLabel as="legend">Author type</FormLabel>
                  <RadioGroup>
                    <HStack gap={4}>
                      {config?.taxonomies.UNFCCC.author_type.allowed_values.map(
                        (authorType) => (
                          <Radio
                            bg="white"
                            value={authorType}
                            {...register('author_type')}
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
              </>
            )}
            {watchOrganisation === 'CCLW' && (
              <>
                {/* {Object.keys(config?.taxonomies.CCLW || {}).map(
                  (taxonomy: TCCLWTaxonomy | null) => {
                    if (Object.keys.length === 0 || !taxonomy) return null

                    const options = config.taxonomies.CCLW[taxonomy]
                      .allowed_values as string[]
                    return (
                      <Controller
                        control={control}
                        name={taxonomy}
                        key={taxonomy}
                        render={({ field }) => {
                          return (
                            <FormControl>
                              <FormLabel>{taxonomy}</FormLabel>
                              <CRSelect
                                chakraStyles={chakraStyles}
                                isClearable={false}
                                isMulti={true}
                                isSearchable={true}
                                options={generateOptions(options)}
                                {...field}
                              />
                            </FormControl>
                          )
                        }}
                      />
                    )
                  },
                )} */}
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
          </VStack>

          <ButtonGroup>
            <Button
              type="submit"
              colorScheme="blue"
              onSubmit={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              Create new Family
            </Button>
          </ButtonGroup>
        </form>
      )}
    </>
  )
}
