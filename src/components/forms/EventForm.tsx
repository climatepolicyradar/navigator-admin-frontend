import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  IEvent,
  IEventFormPost,
  IError,
  IEventFormPut,
  TTaxonomy,
} from '@/interfaces'
import { eventSchema } from '@/schemas/eventSchema'
import { createEvent, updateEvent } from '@/api/Events'

import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  ButtonGroup,
  FormErrorMessage,
  useToast,
  Select,
} from '@chakra-ui/react'
import { formatDateISO } from '@/utils/formatDate'
import { ApiError } from '../feedback/ApiError'

type TProps = {
  familyId?: string
  canModify?: boolean
  event?: IEvent
  taxonomy: TTaxonomy
  onSuccess?: (eventId: string) => void
}

type TEventForm = {
  event_title: string
  date: string
  event_type_value: string
}

export const EventForm = ({
  familyId,
  canModify = false,
  event: loadedEvent,
  taxonomy,
  onSuccess,
}: TProps) => {
  const toast = useToast()
  const [formError, setFormError] = useState<IError | null | undefined>()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TEventForm>({
    resolver: yupResolver(eventSchema),
    defaultValues: loadedEvent
      ? {
          event_title: loadedEvent.event_title,
          date: loadedEvent.date ? formatDateISO(loadedEvent.date) : '',
          event_type_value: loadedEvent.event_type_value,
        }
      : undefined,
  })

  // Preload form with event data when loadedEvent changes
  useEffect(() => {
    if (loadedEvent) {
      reset({
        event_title: loadedEvent.event_title,
        date: loadedEvent.date ? formatDateISO(loadedEvent.date) : '',
        event_type_value: loadedEvent.event_type_value,
      })
    }
  }, [loadedEvent, reset])

  const handleFormSubmission = async (event: TEventForm) => {
    setFormError(null)

    const eventDateFormatted = new Date(event.date)

    if (loadedEvent) {
      const eventPayload: IEventFormPut = {
        event_title: event.event_title,
        date: eventDateFormatted,
        event_type_value: event.event_type_value,
        metadata: {
          event_type: [event.event_type_value],
          datetime_event_name:
            taxonomy._event.datetime_event_name.allowed_values,
        },
      }

      try {
        const data = await updateEvent(eventPayload, loadedEvent.import_id)
        toast({
          title: 'Event has been successfully updated',
          status: 'success',
          position: 'top',
        })
        onSuccess && onSuccess(data.response.import_id)
      } catch (error) {
        setFormError(error as IError)
        toast({
          title: 'Event has not been updated',
          description: (error as IError).message,
          status: 'error',
          position: 'top',
        })
      }
    } else {
      if (!familyId) {
        toast({
          title: 'Error',
          description: 'Family ID is required for event creation',
          status: 'error',
          position: 'top',
        })
        return
      }

      const eventPayload: IEventFormPost = {
        family_import_id: familyId,
        event_title: event.event_title,
        date: eventDateFormatted,
        event_type_value: event.event_type_value,
        metadata: {
          event_type: [event.event_type_value],
          datetime_event_name:
            taxonomy._event.datetime_event_name.allowed_values,
        },
      }

      try {
        const data = await createEvent(eventPayload)
        toast({
          title: 'Event has been successfully created',
          status: 'success',
          position: 'top',
        })
        onSuccess && onSuccess(data.response)
      } catch (error) {
        setFormError(error as IError)
        toast({
          title: 'Event has not been created',
          description: (error as IError).message,
          status: 'error',
          position: 'top',
        })
      }
    }
  }

  const onSubmit: SubmitHandler<TEventForm> = (data) =>
    handleFormSubmission(data)

  const invalidEventCreation = !loadedEvent && !familyId

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap='4' mb={12} align={'stretch'}>
          {formError && <ApiError error={formError} />}
          <FormControl isRequired isInvalid={!!errors.event_title}>
            <FormLabel>Event Title</FormLabel>
            <Input
              {...register('event_title')}
              placeholder='Enter event title'
              isReadOnly={!canModify}
            />
            {errors.event_title && (
              <FormErrorMessage>{errors.event_title.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.date}>
            <FormLabel htmlFor='event-date'>Date</FormLabel>
            <Input
              id='event-date'
              type='date'
              {...register('date')}
              isReadOnly={!canModify}
              aria-label='Date'
            />
            {errors.date && (
              <FormErrorMessage>{errors.date.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.event_type_value}>
            <FormLabel>Event Type</FormLabel>
            <Select
              {...register('event_type_value')}
              placeholder='Select event type'
              isReadOnly={!canModify}
            >
              {/* Add event type options from taxonomy if available */}
              {taxonomy?._event?.event_type &&
                taxonomy._event.event_type.allowed_values?.map(
                  (type: string) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ),
                )}
            </Select>
            {errors.event_type_value && (
              <FormErrorMessage>
                {errors.event_type_value.message}
              </FormErrorMessage>
            )}
          </FormControl>

          <ButtonGroup isDisabled={!canModify}>
            <Button
              type='submit'
              colorScheme='blue'
              isLoading={isSubmitting}
              isDisabled={!canModify || invalidEventCreation}
            >
              {loadedEvent ? 'Update Event' : 'Create New Event'}
            </Button>
          </ButtonGroup>
        </VStack>
      </form>
    </>
  )
}
