import { useEffect, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ICorpus, ICorpusFormPost, IError, TOrganisation } from '@/interfaces'
import { corpusSchema } from '@/schemas/corpusSchema'
import { createCorpus, updateCorpus } from '@/api/Corpora'
import { WYSIWYG } from '../form-components/WYSIWYG'
import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Textarea,
  VStack,
  Button,
  ButtonGroup,
  FormErrorMessage,
  useToast,
  FormHelperText,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../feedback/ApiError'
import { decodeToken } from '@/utils/decodeToken'
import { config } from 'process'
import { chakraStylesSelect } from '@/styles/chakra'
import { Select as CRSelect } from 'chakra-react-select'
import useConfig from '@/hooks/useConfig'

interface ICorpusForm {
  title: string
  description?: string
  corpus_text: string | null
  corpus_image_url: string | null
  corpus_type_name?: string
  corpus_type_description?: string
}

type TProps = {
  corpus?: ICorpus
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
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(corpusSchema),
  })
  const { config, loading: configLoading, error: configError } = useConfig()

  const handleFormSubmission = async (corpus: ICorpusForm) => {
    setFormError(null)
    console.log('🚀 Starting form submission...')

    const corpusData: ICorpusFormPost = {
      title: corpus.title,
      description: corpus.description,
      corpus_text: corpus.corpus_text || null,
      corpus_image_url: corpus.corpus_image_url || null,
      corpus_type_name: corpus.corpus_type_name?.label || null,
      corpus_type_description: corpus.corpus_type_description,
    }

    if (loadedCorpus) {
      console.log('🔄 Updating existing corpus...')
      return await updateCorpus(corpusData, loadedCorpus.import_id)
        .then(() => {
          toast.closeAll()
          toast({
            title: 'Corpus has been successfully updated',
            status: 'success',
            position: 'top',
          })
        })
        .catch((error: IError) => {
          setFormError(error)
          toast({
            title: 'Corpus has not been updated',
            description: error.message,
            status: 'error',
            position: 'top',
          })
        })
    }

    console.log('✨ Creating new corpus...')
    return await createCorpus(corpusData)
      .then((data) => {
        toast.closeAll()
        toast({
          title: 'Corpus has been successfully created',
          status: 'success',
          position: 'top',
        })
        navigate(`/corpus/${data.response}/edit`, { replace: true })
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
  } // end handleFormSubmission

  const onSubmit: SubmitHandler<ICorpusForm> = (data) => {
    handleFormSubmission(data).catch((error: IError) => {
      console.error(error)
    })
  }

  // object type is workaround for SubmitErrorHandler<FieldErrors> throwing a tsc error.
  const onSubmitErrorHandler = (error: object) => {
    console.log('onSubmitErrorHandler', error)
  }

  const corpusTextOnChange = (html: string) => {
    setValue('corpus_text', html, { shouldDirty: true })
  }

  const updateCorpusTypeDescription = (typeName: string | undefined) => {
    const selectedType = config?.corpus_types?.find(
      (ct) => ct.name === typeName,
    )
    setValue('corpus_type_description', selectedType?.description || '', {
      shouldDirty: true,
    })
  }

  useEffect(() => {
    if (loadedCorpus) {
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
      })
      updateCorpusTypeDescription(loadedCorpus.corpus_type_name)
    }
  }, [loadedCorpus, reset])

  const watchedCorpusTypeName = watch('corpus_type_name')

  useEffect(() => {
    if (watchedCorpusTypeName) {
      updateCorpusTypeDescription(watchedCorpusTypeName.label)
    }
  }, [watchedCorpusTypeName, config])

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
            <FormLabel>Description</FormLabel>
            <Textarea
              height={'100px'}
              bg='white'
              {...register('description')}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Corpus Text</FormLabel>
            <WYSIWYG
              html={loadedCorpus?.corpus_text}
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
                      config?.corpus_types?.map((ct) => ({
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
          <FormControl isRequired>
            <FormLabel>Corpus Type Description</FormLabel>
            <Textarea
              height={'100px'}
              bg='white'
              {...register('corpus_type_description')}
            />
          </FormControl>
          <ButtonGroup>
            <Button
              type='submit'
              colorScheme='blue'
              onSubmit={handleSubmit(onSubmit, onSubmitErrorHandler)}
              disabled={isSubmitting}
            >
              {(loadedCorpus ? 'Update ' : 'Create new ') + ' Corpus'}
            </Button>
          </ButtonGroup>
        </VStack>
      </form>
    </>
  )
}
