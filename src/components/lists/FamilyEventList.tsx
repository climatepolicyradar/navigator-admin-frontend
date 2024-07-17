import { Flex, useToast } from '@chakra-ui/react'
import { FamilyEvent } from '../family/FamilyEvent'
import { IError, IEvent } from '@/interfaces'
import { TChildEntity } from '../forms/FamilyForm'
import { deleteEvent } from '@/api/Events'

type TProps = {
  familyEvents: string[]
  canModify: (
    orgName: string | null,
    isSuperUser: boolean,
    userAccess?:
      | never[]
      | null
      | {
          [key: string]: {
            is_admin: boolean
          }
        },
  ) => boolean
  orgName: string | null
  isSuperUser: boolean
  userAccess:
    | never[]
    | null
    | {
        [key: string]: {
          is_admin: boolean
        }
      }
  onEditEntityClick: (entityType: TChildEntity, entityId: IEvent) => void
  setFamilyEvents: (events: string[]) => void
}

export const FamilyEventList = ({
  familyEvents,
  canModify,
  orgName,
  isSuperUser,
  userAccess,
  onEditEntityClick,
  setFamilyEvents,
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
      {familyEvents.length && (
        <Flex direction='column' gap={4}>
          {familyEvents.map((familyEvent) => (
            <FamilyEvent
              canModify={canModify(orgName, isSuperUser, userAccess)}
              eventId={familyEvent}
              key={familyEvent}
              onEditClick={(event) => onEditEntityClick('event', event)}
              onDeleteClick={onEventDeleteClick}
            />
          ))}
        </Flex>
      )}
    </>
  )
}
