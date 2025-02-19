import { WarningIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Divider,
  AbsoluteCenter,
  Flex,
  Text,
} from '@chakra-ui/react'

import { FamilyEvent } from '@/components/family/FamilyEvent'
import { IEvent } from '@/interfaces'

type TProps = {
  familyEvents: string[]
  userCanModify: boolean
  onAddNew: (type: 'event') => void
  onEdit: (type: 'event', event: IEvent) => void
  onDelete: (eventId: string) => void
  updatedEvent: string
  setUpdatedEvent: (id: string) => void
  isNewFamily: boolean
}

export const EventSection = ({
  familyEvents,
  userCanModify,
  onAddNew,
  onEdit,
  onDelete,
  updatedEvent,
  setUpdatedEvent,
  isNewFamily,
}: TProps) => {
  return (
    <>
      <Box position='relative' padding='10'>
        <Divider />
        <AbsoluteCenter bg='gray.50' px='4'>
          Events
        </AbsoluteCenter>
      </Box>

      {isNewFamily && (
        <Text>
          Please create the family first before attempting to add events
        </Text>
      )}

      {familyEvents.length > 0 && (
        <Flex direction='column' gap={4}>
          {familyEvents.map((eventId) => (
            <FamilyEvent
              key={eventId}
              eventId={eventId}
              canModify={userCanModify}
              onEditClick={(event) => onEdit('event', event)}
              onDeleteClick={onDelete}
              updatedEvent={updatedEvent}
              setUpdatedEvent={setUpdatedEvent}
            />
          ))}
        </Flex>
      )}

      {!isNewFamily && (
        <Box>
          <Button
            isDisabled={!userCanModify}
            onClick={() => onAddNew('event')}
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
