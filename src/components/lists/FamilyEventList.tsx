import { Flex } from '@chakra-ui/react'
import { FamilyEvent } from '../family/FamilyEvent'
import { IEvent } from '@/interfaces'
import { TChildEntity } from '../forms/FamilyForm'

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
  onEventDeleteClick: (eventId: string) => void
}

export const FamilyEventList = ({
  familyEvents,
  canModify,
  orgName,
  isSuperUser,
  userAccess,
  onEditEntityClick,
  onEventDeleteClick,
}: TProps) => {
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
