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
  organisation: string
  canModify: (
    orgName: string | null,
    isSuperUser: boolean,
    userAccess:
      | never[]
      | null
      | {
          [key: string]: {
            is_admin: boolean
          }
        },
  ) => boolean
  isSuperUser: boolean
  userAccess:
    | never[]
    | null
    | {
        [key: string]: {
          is_admin: boolean
        }
      }
  taxonomy?: IConfigTaxonomyCCLW | IConfigTaxonomyUNFCCC
  onSuccess?: (eventId: string) => void
  onClose: () => void
  isOpen: boolean
}

export const EventEditDrawer = ({
  editingEvent,
  loadedFamilyId,
  organisation,
  canModify,
  isSuperUser,
  userAccess,
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
              canModify={canModify(organisation, isSuperUser, userAccess)}
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
