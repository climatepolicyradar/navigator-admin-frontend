import React from 'react'
import { DocumentEditDrawer } from './DocumentEditDrawer'
import { EventEditDrawer } from './EventEditDrawer'
import { TDocument, TEvent } from '@/interfaces'

interface EntityEditDrawerProps {
  isOpen: boolean
  onClose: () => void
  entity: 'document' | 'event'
  document?: TDocument
  event?: TEvent
  onDocumentSuccess?: (document: TDocument) => void
  onEventSuccess?: (event: TEvent) => void
  familyId?: string
  taxonomy?: any
  canModify?: boolean
}

export const EntityEditDrawer: React.FC<EntityEditDrawerProps> = ({
  isOpen,
  onClose,
  entity,
  document,
  event,
  onDocumentSuccess,
  onEventSuccess,
  familyId,
  taxonomy,
  canModify,
}) => {
  if (entity === 'document') {
    return (
      <DocumentEditDrawer
        isOpen={isOpen}
        onClose={onClose}
        document={document}
        onSuccess={onDocumentSuccess}
        familyId={familyId}
        taxonomy={taxonomy}
        canModify={canModify}
      />
    )
  }

  if (entity === 'event') {
    return (
      <EventEditDrawer
        isOpen={isOpen}
        onClose={onClose}
        event={event}
        onSuccess={onEventSuccess}
        familyId={familyId}
        taxonomy={taxonomy}
        canModify={canModify}
      />
    )
  }

  return null
}
