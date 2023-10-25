import { useEffect, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { IEvent, IEventFormPost, IError, IEventFormPut } from '@/interfaces'
import { eventSchema } from '@/schemas/eventSchema'
import { createEvent, updateEvent } from '@/api/Events'

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Button,
  ButtonGroup,
  FormErrorMessage,
  useToast,
  Select,
} from '@chakra-ui/react'
import useConfig from '@/hooks/useConfig'
import { ApiError } from '../feedback/ApiError'
import { FormLoader } from '../feedback/FormLoader'
import { formatDateISO } from '@/utils/formatDate'

type TProps = {
  familyId: string
  event?: IEvent
  onSuccess?: (eventId: string) => void
}

type TEventForm = {
  event_title: string
  date: string
  event_type_value: string
}

export const EventForm = ({
  familyId,
  event: loadedEvent,
  onSuccess,
}: TProps) => {
  const toast = useToast()
  const { config, loading: configLoading, error: configError } = useConfig()
  const [formError, setFormError] = useState<IError | null | undefined>()
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(eventSchema),
  })

  const handleFormSubmission = async (event: TEventForm) => {
    setFormError(null)

    const eventDateFormatted = new Date(event.date)

    if (loadedEvent) {
      const eventPayload: IEventFormPut = {
        event_title: event.event_title,
        date: eventDateFormatted,
        event_type_value: event.event_type_value,
      }

      return await updateEvent(eventPayload, loadedEvent.import_id)
        .then((data) => {
          toast.closeAll()
          toast({
            title: 'Event has been successfully updated',
            status: 'success',
            position: 'top',
          })
          onSuccess && onSuccess(data.response.import_id)
        })
        .catch((error: IError) => {
          setFormError(error)
          toast({
            title: 'Event has not been updated',
            description: error.message,
            status: 'error',
            position: 'top',
          })
        })
    }

    const eventPayload: IEventFormPost = {
      family_import_id: familyId,
      event_title: event.event_title,
      date: eventDateFormatted,
      event_type_value: event.event_type_value,
    }

    return await createEvent(eventPayload)
      .then((data) => {
        toast.closeAll()
        toast({
          title: 'Event has been successfully created',
          status: 'success',
          position: 'top',
        })
        onSuccess && onSuccess(data.response)
      })
      .catch((error: IError) => {
        setFormError(error)
        toast({
          title: 'Event has not been created',
          description: error.message,
          status: 'error',
          position: 'top',
        })
      })
  } // end handleFormSubmission

  const onSubmit: SubmitHandler<TEventForm> = (data) =>
    handleFormSubmission(data)

  useEffect(() => {
    if (loadedEvent) {
      const eventDateFormatted = formatDateISO(loadedEvent.date)

      reset({
        event_title: loadedEvent.event_title,
        date: eventDateFormatted,
        event_type_value: loadedEvent.event_type_value,
      })
    }
  }, [loadedEvent, reset])

  return (
    <>
      {configError && <ApiError error={configError} />}
      {configLoading && <FormLoader />}
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
            <FormLabel>Title</FormLabel>
            <Input bg="white" {...register('event_title')} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Input type="date" bg="white" {...register('date')} />
          </FormControl>
          <Controller
            control={control}
            name="event_type_value"
            render={({ field }) => {
              return (
                <FormControl
                  isRequired
                  as="fieldset"
                  isInvalid={!!errors.event_type_value}
                >
                  <FormLabel as="legend">Type</FormLabel>
                  <Select background="white" {...field}>
                    <option value="">Please select</option>
                    {config?.event?.types.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>
                    Please select a type for this event
                  </FormErrorMessage>
                </FormControl>
              )
            }}
          />
          <ButtonGroup>
            <Button
              type="submit"
              colorScheme="blue"
              onSubmit={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              Create new Event
            </Button>
          </ButtonGroup>
        </VStack>
      </form>
    </>
  )
}
