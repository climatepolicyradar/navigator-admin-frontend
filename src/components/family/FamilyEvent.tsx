import {
  Card,
  CardBody,
  CardFooter,
  Text,
  Stack,
  HStack,
  Spinner,
  Button,
} from '@chakra-ui/react'
import { useEffect } from 'react'

import useEvent from '@/hooks/useEvent'
import { IEvent } from '@/interfaces'
import { formatDate } from '@/utils/formatDate'

import { DeleteButton } from '../buttons/Delete'
import { ApiError } from '../feedback/ApiError'

type TProps = {
  eventId: string
  canModify: boolean
  onEditClick?: (event: IEvent) => void
  onDeleteClick?: (eventId: string) => void
  updatedEvent: string
  setUpdatedEvent: (updateEvent: string) => void
}

export const FamilyEvent = ({
  eventId,
  canModify,
  onEditClick,
  onDeleteClick,
  updatedEvent,
  setUpdatedEvent,
}: TProps) => {
  const { event, loading, error, reload } = useEvent(eventId)

  useEffect(() => {
    if (updatedEvent === eventId) {
      reload()
      setUpdatedEvent('')
    }
  }, [updatedEvent, setUpdatedEvent, reload, eventId])

  const handleEditClick = () => {
    onEditClick && event ? onEditClick(event) : null
  }

  const handleDeleteClick = () => {
    onDeleteClick && onDeleteClick(eventId)
  }

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return (
      <Card direction='row'>
        <ApiError error={error} />
      </Card>
    )
  }

  return (
    <Card direction='row'>
      <CardBody>
        <Text mb='2'>{event?.event_title}</Text>
        <HStack divider={<Text>·</Text>} gap={4}>
          {event?.date && <Text>Date: {formatDate(event.date)}</Text>}
          {event?.event_type_value && (
            <Text>Type: {event.event_type_value}</Text>
          )}
        </HStack>
      </CardBody>
      {(!!onEditClick || !!onDeleteClick) && (
        <CardFooter>
          <Stack direction='row' spacing={4}>
            {!!onEditClick && (
              <Button
                size='sm'
                onClick={handleEditClick}
                data-testid={`edit-${eventId}`}
              >
                Edit
              </Button>
            )}
            {!!onDeleteClick && (
              <DeleteButton
                isDisabled={!canModify}
                entityName='event'
                entityTitle={event?.event_title || ''}
                callback={handleDeleteClick}
              />
            )}
          </Stack>
        </CardFooter>
      )}
    </Card>
  )
}
