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
  Input,
  Divider,
  IconButton,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../feedback/ApiError'
import { InfoOutlineIcon, CopyIcon } from '@chakra-ui/icons'
import { TextField } from './fields/TextField'
import { FormLoader } from '../feedback/FormLoader'
import { IAppTokenFormPost } from '@/interfaces/AppToken'
import useCorpora from '@/hooks/useCorpora'
import * as Yup from 'yup'
import { SelectField } from '@/components/forms/fields/SelectField'
import { jwtDecode } from 'jwt-decode'

type TProps = {
  corpus?: ICorpus
}

export type IAppTokenFormSubmit = Yup.InferType<typeof appTokenSchema>

interface JWTPayload {
  sub: string
  aud: string
  allowed_corpora_ids?: string[]
}

export const AppTokenForm = ({ corpus: loadedCorpus }: TProps) => {
  const navigate = useNavigate()
  const toast = useToast()
  const [formError, setFormError] = useState<IError | null | undefined>()
  const [createdAppToken, setCreatedAppToken] = useState<string | null>(null)
  const { onCopy, hasCopied } = useClipboard(createdAppToken || '')
  const [pastedToken, setPastedToken] = useState<string>('')

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

  const handleTokenPaste = useCallback(() => {
    try {
      const decoded = jwtDecode<JWTPayload>(pastedToken)

      // Populate theme (subject)
      if (decoded.sub) setValue('theme', decoded.sub)

      // Populate hostname (audience)
      if (decoded.aud) {
        const httpScheme = decoded.aud.includes('localhost')
          ? 'http://'
          : 'https://'
        setValue('hostname', httpScheme + decoded.aud)
      }

      // Populate corpora IDs
      if (decoded.allowed_corpora_ids?.length) {
        const matchingCorpora = corpora.filter((corpus) =>
          decoded.allowed_corpora_ids?.includes(corpus.import_id),
        )

        const corporaOptions = matchingCorpora.map((corpus) => ({
          value: corpus.import_id,
          label: corpus.title,
        }))

        setValue('corpora_ids', corporaOptions)
      }

      toast({
        title: 'Token decoded successfully',
        status: 'success',
        position: 'top',
      })
    } catch (error) {
      toast({
        title: 'Invalid token',
        description: 'Could not decode the provided token',
        status: 'error',
        position: 'top',
      })
    }
  }, [pastedToken, corpora, setValue, toast])

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
          setCreatedAppToken(appToken)
          // Copy token to clipboard on create success
          navigator.clipboard.writeText(appToken).then(() => {
            toast({
              title: 'App token copied to clipboard',
              status: 'success',
              position: 'top',
            })
          })
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
              onDoubleClick={() => {
                onCopy()
                toast({
                  title: 'Token copied to clipboard',
                  status: 'success',
                  duration: 2000,
                  position: 'top',
                })
              }}
            >
              <Code
                p={2}
                bg='green.100'
                borderRadius='md'
                whiteSpace='normal'
                wordBreak='break-all'
                width='100%'
                cursor='copy'
              >
                {createdAppToken}
              </Code>
            </Box>
          )}

          <FormControl>
            <FormLabel>Paste Existing Token (Optional)</FormLabel>
            <Input
              placeholder='Paste your existing app token here'
              value={pastedToken}
              onChange={(e) => setPastedToken(e.target.value)}
            />
            <Button
              mt={2}
              size='sm'
              onClick={handleTokenPaste}
              isDisabled={!pastedToken}
            >
              Decode Token
            </Button>
          </FormControl>

          <Divider />

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
