import { useEffect, useRef, useState, useCallback } from 'react'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { IError } from '@/interfaces'
import { corpusTypeSchema } from '@/schemas/corpusTypeSchema'
import {
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  Button,
  ButtonGroup,
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
import { ApiError } from '../feedback/ApiError'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { TextField } from './fields/TextField'
import * as Yup from 'yup'
import { ICorpusType } from '@/interfaces/CorpusType'

type TProps = {
  corpusType?: ICorpusType
}

export type ICorpusTypeFormSubmit = Yup.InferType<typeof corpusTypeSchema>

export const CorpusTypeForm = ({ corpusType: loadedCorpusType }: TProps) => {
  const toast = useToast()
  const [formError, setFormError] = useState<IError | null | undefined>()
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
    getValues,
  } = useForm<ICorpusTypeFormSubmit>({
    resolver: yupResolver(corpusTypeSchema),
  })

  const initialDescription = useRef<string | undefined>(
    loadedCorpusType?.description,
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const handleFormSubmission = useCallback(
    // TODO: Remove under APP-54.
    /* trunk-ignore(eslint/@typescript-eslint/require-await) */
    async (formValues: ICorpusTypeFormSubmit) => {
      setFormError(null)

      // Only check for corpus type description changes if updating an existing corpus
      if (
        loadedCorpusType &&
        formValues.description !== initialDescription.current &&
        !isConfirmed
      ) {
        setIsModalOpen(true)
        return
      }

      if (loadedCorpusType) {
        toast({
          title: 'Not implemented',
          description: 'Corpus type update has not been implemented',
          status: 'error',
          position: 'top',
        })
      } else {
        toast({
          title: 'Not implemented',
          description: 'Corpus type update has not been implemented',
          status: 'error',
          position: 'top',
        })
      }
    },
    [loadedCorpusType, isConfirmed, initialDescription, toast, setFormError],
  )

  const onSubmit: SubmitHandler<ICorpusTypeFormSubmit> = useCallback(
    (data) => {
      handleFormSubmission(data).catch((error: IError) => {
        console.error(error)
      })
    },
    [handleFormSubmission],
  )

  const onSubmitErrorHandler: SubmitErrorHandler<ICorpusTypeFormSubmit> =
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

  useEffect(() => {
    handleFormSubmissionWithConfirmation()
  }, [handleFormSubmissionWithConfirmation])

  useEffect(() => {
    if (loadedCorpusType) {
      reset({
        name: loadedCorpusType?.name || '',
        description: loadedCorpusType?.description || '',
      })
    }
  }, [loadedCorpusType, reset])

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onSubmitErrorHandler)}>
        <VStack gap='4' mb={12} align={'stretch'}>
          {formError && <ApiError error={formError} />}

          <TextField
            name='name'
            label='Title'
            control={control}
            isRequired={true}
          />

          <FormControl isRequired>
            <FormLabel>
              Description
              <Tooltip label='Updating this will also apply this change to all other corpora of this type'>
                <Icon as={InfoOutlineIcon} ml={2} cursor='pointer' />
              </Tooltip>
            </FormLabel>
            <Textarea
              height={'100px'}
              bg='white'
              {...register('description')}
            />
          </FormControl>

          <Modal isOpen={isModalOpen} onClose={handleModalCancel}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirm Update</ModalHeader>
              <ModalCloseButton />
              <ModalBody data-testid='modal-body'>
                <p>
                  You have changed the corpus type description of{' '}
                  <strong>{getValues('name') || 'unknown'}</strong>.
                </p>
                <br></br>
                <p>
                  This will update all corpora with the type{' '}
                  <strong>{getValues('name') || 'unknown'}</strong> with the
                  description{' '}
                  <em style={{ color: 'blue' }}>
                    {getValues('description') || 'unknown'}
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
              {(loadedCorpusType ? 'Update ' : 'Create new ') + 'Corpus type'}
            </Button>
          </ButtonGroup>
        </VStack>
      </form>
    </>
  )
}
