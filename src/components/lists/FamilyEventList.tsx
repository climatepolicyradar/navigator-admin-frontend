import {
  AbsoluteCenter,
  Box,
  Divider,
  Flex,
  useToast,
  Text,
  Button,
} from '@chakra-ui/react'
import { FamilyEvent } from '../family/FamilyEvent'
import { IError, IEvent, TFamily } from '@/interfaces'
import { TChildEntity } from '../forms/FamilyForm'
import { deleteEvent } from '@/api/Events'
import { WarningIcon } from '@chakra-ui/icons'

type TProps = {
  familyEvents: string[]
  canModify: boolean
  onEditEntityClick: (entityType: TChildEntity, entityId: IEvent) => void
  onAddNewEntityClick: (entityType: TChildEntity) => void
  setFamilyEvents: (events: string[]) => void
  loadedFamily?: TFamily
  updateEvent: boolean
  setUpdateEvent: (updateEvent: boolean) => void
}

export const FamilyEventList = ({
  familyEvents,
  canModify,
  onEditEntityClick,
  onAddNewEntityClick,
  setFamilyEvents,
  loadedFamily,
  updateEvent,
  setUpdateEvent,
}: TProps) => {
  const toast = useToast()

  const onEventDeleteClick = async (eventId: string) => {
    toast({
      title: 'Event deletion in progress',
      status: 'info',
      position: 'top',
    })
    await deleteEvent(eventId)
      .then(() => {
        toast({
          title: 'Document has been successful deleted',
          status: 'success',
          position: 'top',
        })
        const index = familyEvents.indexOf(eventId)
        if (index > -1) {
          const newEvents = [...familyEvents]
          newEvents.splice(index, 1)
          setFamilyEvents(newEvents)
        }
      })
      .catch((error: IError) => {
        toast({
          title: 'Event has not been deleted',
          description: error.message,
          status: 'error',
          position: 'top',
        })
      })
  }

  return (
    <>
      <Box position='relative' padding='10'>
        <Divider />
        <AbsoluteCenter bg='gray.50' px='4'>
          Events
        </AbsoluteCenter>
      </Box>
      {!loadedFamily && (
        <Text>
          Please create the family first before attempting to add events
        </Text>
      )}
      {familyEvents.length > 0 && (
        <Flex direction='column' gap={4}>
          {familyEvents.map((familyEvent) => (
            <FamilyEvent
              canModify={canModify}
              eventId={familyEvent}
              key={familyEvent}
              onEditClick={(event) => onEditEntityClick('event', event)}
              onDeleteClick={onEventDeleteClick}
              updateEvent={updateEvent}
              setUpdateEvent={setUpdateEvent}
            />
          ))}
        </Flex>
      )}
      {loadedFamily && (
        <Box>
          <Button
            isDisabled={!canModify}
            onClick={() => onAddNewEntityClick('event')}
            rightIcon={
              familyEvents.length === 0 ? (
                <WarningIcon
                  color='red.500'
                  data-test-id='warning-icon-event'
                />
              ) : undefined
            }
          >
            Add new Event
          </Button>
        </Box>
      )}
    </>
  )
}
