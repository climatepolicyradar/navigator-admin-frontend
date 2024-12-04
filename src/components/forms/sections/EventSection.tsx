import React from 'react'
import { FamilyEventList } from '@/components/lists/FamilyEventList'
import { IEvent } from '@/interfaces'

interface EventSectionProps {
  familyEvents: string[]
  userCanModify: boolean
  onAddNew: (type: 'event') => void
  onEdit: (type: 'event', event: IEvent) => void
  updatedEvent: string
  setUpdatedEvent: (id: string) => void
  isNewFamily: boolean
  onSetFamilyEvents: (events: string[]) => void
}

export const EventSection: React.FC<EventSectionProps> = ({
  familyEvents,
  userCanModify,
  onAddNew,
  onEdit,
  updatedEvent,
  setUpdatedEvent,
  isNewFamily,
  onSetFamilyEvents,
}) => {
  return (
    <FamilyEventList
      familyEvents={familyEvents}
      setFamilyEvents={onSetFamilyEvents}
      canModify={userCanModify}
      onEditEntityClick={(event) => onEdit('event', event)}
      onAddNewEntityClick={() => onAddNew('event')}
      loadedFamily={!isNewFamily}
      updatedEvent={updatedEvent}
      setUpdatedEvent={setUpdatedEvent}
    />
  )
}
