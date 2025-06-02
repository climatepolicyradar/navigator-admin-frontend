import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react'

import { IEvent, TTaxonomy } from '@/interfaces'
import { formatDate } from '@/utils/formatDate'

import { EventForm } from '../forms/EventForm'

type TProps = {
  event?: IEvent
  familyId?: string
  onClose: () => void
  isOpen: boolean
  onSuccess?: (eventId: string) => void
  canModify?: boolean
  taxonomy?: TTaxonomy
}

export const EventEditDrawer = ({
  event: loadedEvent,
  familyId,
  onClose,
  isOpen,
  onSuccess,
  canModify,
  taxonomy,
}: TProps) => {
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
