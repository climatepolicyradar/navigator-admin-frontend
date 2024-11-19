import { formatDate } from '@/utils/formatDate'
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react'
import { IEvent } from '@/interfaces'
import { PropsWithChildren } from 'react'

type TProps = {
  editingEvent?: IEvent
  onClose: () => void
  isOpen: boolean
}

export const EventEditDrawer = ({
  editingEvent,
  onClose,
  isOpen,
  children,
}: PropsWithChildren<TProps>) => {
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
          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
