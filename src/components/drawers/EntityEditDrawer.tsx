import { IDocument, IEvent, TTaxonomy } from '@/interfaces'

import { DocumentEditDrawer } from './DocumentEditDrawer'
import { EventEditDrawer } from './EventEditDrawer'

type TProps = {
  isOpen: boolean
  onClose: () => void
  entity: 'document' | 'event'
  document?: IDocument
  event?: IEvent
  onDocumentSuccess?: (documentId: string) => void
  onEventSuccess?: (eventId: string) => void
  familyId?: string
  taxonomy: TTaxonomy
  canModify?: boolean
}

export const EntityEditDrawer = ({
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
}: TProps) => {
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
