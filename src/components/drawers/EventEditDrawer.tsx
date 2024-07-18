import { formatDate } from '@/utils/formatDate'
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react'
import { EventForm } from '../forms/EventForm'
import {
  IConfigTaxonomyCCLW,
  IConfigTaxonomyUNFCCC,
  IEvent,
} from '@/interfaces'

type TProps = {
  editingEvent?: IEvent
  loadedFamilyId: string
  canModify: boolean
  taxonomy?: IConfigTaxonomyCCLW | IConfigTaxonomyUNFCCC
  onSuccess?: (eventId: string) => void
  onClose: () => void
  isOpen: boolean
}

export const EventEditDrawer = ({
  editingEvent,
  loadedFamilyId,
  canModify,
  taxonomy,
  onSuccess,
  onClose,
  isOpen,
}: TProps) => {
  return (
    <>
      <Drawer placement='right' onClose={onClose} isOpen={isOpen} size='lg'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            {editingEvent
              ? `Edit: ${editingEvent.event_title}, on ${formatDate(editingEvent.date)}`
              : 'Add new Event'}
          </DrawerHeader>
          <DrawerBody>
            <EventForm
              familyId={loadedFamilyId}
              canModify={canModify}
              taxonomy={taxonomy}
              event={editingEvent}
              onSuccess={onSuccess}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
