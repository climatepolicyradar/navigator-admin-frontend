import React from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react'
import { TEvent } from '@/interfaces'
import { EventForm } from '../forms/EventForm'
import { formatDate } from '@/utils/formatDate'

interface EventEditDrawerProps {
  event?: TEvent
  familyId?: string
  onClose: () => void
  isOpen: boolean
  onSuccess?: (eventId: string) => void
  canModify?: boolean
  taxonomy?: any
}

export const EventEditDrawer: React.FC<EventEditDrawerProps> = ({
  event: loadedEvent,
  familyId,
  onClose,
  isOpen,
  onSuccess,
  canModify,
  taxonomy,
}) => {
  return (
    <Drawer placement='right' onClose={onClose} isOpen={isOpen} size='lg'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth='1px'>
          {loadedEvent
            ? `Edit: ${loadedEvent.event_title}, on ${formatDate(loadedEvent.date)}`
            : 'Add new Event'}
        </DrawerHeader>
        <DrawerBody>
          <EventForm
            event={loadedEvent}
            familyId={familyId}
            canModify={canModify}
            taxonomy={taxonomy}
            onSuccess={(eventId) => {
              onSuccess?.(eventId)
              onClose()
            }}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
