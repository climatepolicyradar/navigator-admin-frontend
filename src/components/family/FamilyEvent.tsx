import useEvent from '@/hooks/useEvent'
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
import { ApiError } from '../feedback/ApiError'
import { DeleteButton } from '../buttons/Delete'
import { formatDate } from '@/utils/formatDate'
import { IEvent } from '@/interfaces'

type TProps = {
  eventId: string
  onEditClick?: (event: IEvent) => void
  onDeleteClick?: (eventId: string) => void
}

export const FamilyEvent = ({
  eventId,
  onEditClick,
  onDeleteClick,
}: TProps) => {
  const { event, loading, error } = useEvent(eventId)

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
              <Button size='sm' onClick={handleEditClick}>
                Edit
              </Button>
            )}
            {!!onDeleteClick && (
              <DeleteButton
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
