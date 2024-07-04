import { useEffect, useMemo, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  ICorpus,
  ICorpusFormPost,
  IDecodedToken,
  IError,
  TOrganisation,
} from '@/interfaces'
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
  } = useForm({
    resolver: yupResolver(corpusSchema),
  })

  const handleFormSubmission = async (corpus: ICorpusForm) => {
    setFormError(null)

    const corpusData: ICorpusFormPost = {
      title: corpus.title,
      description: corpus.description,
      corpus_text: corpus.corpus_text || null,
      corpus_image_url: corpus.corpus_image_url || null,
      corpus_type_name: corpus.corpus_type_name,
      corpus_type_description: corpus.corpus_type_description,
    }

    if (loadedCorpus) {
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

    // return await createCorpus(corpusData)
    //   .then((data) => {
    //     toast.closeAll()
    //     toast({
    //       title: 'Corpus has been successfully created',
    //       status: 'success',
    //       position: 'top',
    //     })
    //     navigate(`/corpus/${data.response}/edit`, { replace: true })
    //   })
    //   .catch((error: IError) => {
    //     setFormError(error)
    //     toast({
    //       title: 'Corpus has not been created',
    //       description: error.message,
    //       status: 'error',
    //       position: 'top',
    //     })
    //   })
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

  useEffect(() => {
    if (loadedCorpus) {
      reset({
        title: loadedCorpus.title,
        description: loadedCorpus.description,
        corpus_text: loadedCorpus.corpus_text,
        corpus_image_url: loadedCorpus.corpus_image_url,
        corpus_type_name: loadedCorpus.corpus_type_name,
        corpus_type_description: loadedCorpus.corpus_type_description,
      })
    }
  }, [loadedCorpus, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit, onSubmitErrorHandler)}>
      <VStack gap='4' mb={12} align={'stretch'}>
        {formError && <ApiError error={formError} />}
        {loadedCorpus && (
          <>
            <FormControl isRequired isReadOnly isDisabled>
              <FormLabel>Import ID</FormLabel>
              <Input bg='white' value={loadedCorpus?.import_id} />
              <FormHelperText>You cannot edit this</FormHelperText>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input bg='white' {...register('title')} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              {/* <Input bg='white' {...register('description')} /> */}
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

            <FormControl isRequired>
              <FormLabel>Corpus Type Name</FormLabel>
              <Input bg='white' {...register('corpus_type_name')} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Corpus Type Description</FormLabel>
              <Textarea
                height={'100px'}
                bg='white'
                {...register('corpus_type_description')}
              />
            </FormControl>
          </>
        )}

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
  )
}
