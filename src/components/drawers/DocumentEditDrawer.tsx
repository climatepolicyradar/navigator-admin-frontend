import React from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react'
import { IDocument, TTaxonomy } from '@/interfaces'
import { DocumentForm } from '../forms/DocumentForm'

interface DocumentEditDrawerProps {
  document?: IDocument
  familyId?: string
  onClose: () => void
  isOpen: boolean
  onSuccess?: (documentId: string) => void
  canModify?: boolean
  taxonomy?: TTaxonomy
}

export const DocumentEditDrawer: React.FC<DocumentEditDrawerProps> = ({
  document,
  familyId,
  onClose,
  isOpen,
  onSuccess,
  canModify,
  taxonomy,
}) => {
  return (
    <Drawer placement='right' onClose={onClose} isOpen={isOpen} size='lg'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth='1px'>
          {document ? `Edit: ${document.title}` : 'Add new Document'}
        </DrawerHeader>
        <DrawerBody>
          <DocumentForm
            document={document}
            familyId={familyId}
            canModify={canModify}
            taxonomy={taxonomy}
            onSuccess={(documentId) => {
              onSuccess?.(documentId)
              onClose()
            }}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
