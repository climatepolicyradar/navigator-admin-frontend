import { formatDate } from '@/utils/formatDate'
import { DrawerBody, DrawerContent, DrawerHeader } from '@chakra-ui/react'
import { EventForm } from './forms/EventForm'
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
}

export const EventEditDrawer = ({
  editingEvent,
  loadedFamilyId,
  organisation,
  canModify,
  isSuperUser,
  userAccess,
  taxonomy,
}: TProps) => {
  return (
    <>
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
          />
        </DrawerBody>
      </DrawerContent>
    </>
  )
}
