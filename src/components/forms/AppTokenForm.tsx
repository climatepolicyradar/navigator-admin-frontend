import { useEffect, useRef, useState, useCallback } from 'react'
import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
  Controller,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { IChakraSelect, ICorpus, IError } from '@/interfaces'
import { appTokenSchema } from '@/schemas/appTokenSchema'
import { createAppToken } from '@/api/AppToken'
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
  Box,
  Code,
  useClipboard,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../feedback/ApiError'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { TextField } from './fields/TextField'
import { FormLoader } from '../feedback/FormLoader'
import { IAppTokenFormPost } from '@/interfaces/AppToken'
import useCorpora from '@/hooks/useCorpora'
import * as Yup from 'yup'
import { SelectField } from '@/components/forms/fields/SelectField'

type TProps = {
  corpus?: ICorpus
}

export type IAppTokenFormSubmit = Yup.InferType<typeof appTokenSchema>

export const AppTokenForm = ({ corpus: loadedCorpus }: TProps) => {
  const navigate = useNavigate()
  const toast = useToast()
  const [formError, setFormError] = useState<IError | null | undefined>()
  const [createdAppToken, setCreatedAppToken] = useState<string | null>(null)
  const { onCopy, hasCopied } = useClipboard(createdAppToken || '')

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    watch,
  } = useForm<IAppTokenFormSubmit>({
    resolver: yupResolver(appTokenSchema),
  })

  const { corpora, error: corporaError, loading: corporaLoading } = useCorpora()

  const handleFormSubmission = useCallback(
    async (formValues: IAppTokenFormSubmit) => {
      setFormError(null)

      const formData: IAppTokenFormPost = {
        theme: formValues.theme,
        hostname: formValues.hostname,
        expiry_years: formValues.expiry_years,
        corpora_ids: formValues.corpora_ids.map(
          (corpus: IChakraSelect) => corpus.value,
        ),
      }

      return await createAppToken(formData)
        .then((response) => {
          const appToken = response.response
          toast.closeAll()
          toast({
            title: 'App token has been successfully created',
            status: 'success',
            position: 'top',
          })
          setCreatedAppToken(appToken)
        })
        .catch((error: IError) => {
          console.error('❌ Error during form submission:', error)
          setFormError(error)
          toast({
            title: 'App token has not been created',
            description: error.message,
            status: 'error',
            position: 'top',
          })
        })
    },
    [loadedCorpus, navigate, toast, setFormError],
  )

  const onSubmit: SubmitHandler<IAppTokenFormSubmit> = useCallback(
    (data) => {
      // Reset created app token when a new submission starts
      setCreatedAppToken(null)
      handleFormSubmission(data).catch((error: IError) => {
        console.error(error)
      })
    },
    [handleFormSubmission],
  )

  const onSubmitErrorHandler: SubmitErrorHandler<IAppTokenFormSubmit> =
    useCallback((errors) => {
      console.error(errors)
    }, [])

  // useEffect(() => {
  //   if (loadedCorpus && !configLoading) {

  //     reset({
  //       import_id: loadedCorpus.import_id || '',
  //       title: loadedCorpus.title || '',
  //       description: loadedCorpus.description || '',
  //       corpus_text: loadedCorpus.corpus_text || '',
  //       corpus_image_url: loadedCorpus.corpus_image_url || '',
  //       corpus_type_name: loadedCorpus.corpus_type_name
  //         ? {
  //             label: loadedCorpus.corpus_type_name,
  //             value: loadedCorpus.corpus_type_name,
  //           }
  //         : undefined,
  //       corpus_type_description: loadedCorpus.corpus_type_description || '',
  //       organisation_id: loadedCorpus.organisation_id
  //         ? {
  //             label: orgName,
  //             value: loadedCorpus.organisation_id,
  //           }
  //         : undefined,
  //     })
  //     updateCorpusTypeDescription(loadedCorpus.corpus_type_name)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [loadedCorpus, configLoading, getOrganisationDisplayNameById, reset])

  return (
    <>
      {corporaError && <ApiError error={corporaError} />}
      {corporaLoading && <FormLoader />}

      <form onSubmit={handleSubmit(onSubmit, onSubmitErrorHandler)}>
        <VStack gap='4' mb={12} align={'stretch'}>
          {formError && <ApiError error={formError} />}

          {createdAppToken && (
            <Box
              bg='green.50'
              p={4}
              borderRadius='md'
              display='flex'
              justifyContent='space-between'
              alignItems='center'
            >
              <Code
                children={createdAppToken}
                p={2}
                bg='green.100'
                borderRadius='md'
                mr={2}
              />
              <Button
                onClick={onCopy}
                size='sm'
                colorScheme={hasCopied ? 'green' : 'blue'}
              >
                {hasCopied ? 'Copied!' : 'Copy'}
              </Button>
            </Box>
          )}

          <TextField
            name='theme'
            label='Theme'
            control={control}
            isRequired={true}
          />

          <TextField
            name='hostname'
            label={
              <>
                'Domain'
                <Tooltip label='This is the internally used description of this corpus'>
                  <Icon as={InfoOutlineIcon} ml={2} cursor='pointer' />
                </Tooltip>
              </>
            }
            control={control}
            isRequired={true}
          />

          <SelectField
            name='corpora_ids'
            label='Allowed Corpora'
            control={control}
            options={corpora.map((corpus) => ({
              value: corpus.import_id,
              label: corpus.title,
            }))}
            isMulti={true}
            isRequired={true}
          />

          <ButtonGroup>
            <Button type='submit' colorScheme='blue' disabled={isSubmitting}>
              {(loadedCorpus ? 'Update ' : 'Create new ') + 'App Token'}
            </Button>
          </ButtonGroup>
        </VStack>
      </form>
    </>
  )
}
