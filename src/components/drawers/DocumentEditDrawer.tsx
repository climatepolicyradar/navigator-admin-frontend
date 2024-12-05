import React from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react'
import { TDocument } from '@/interfaces'
import { DocumentForm } from '../forms/DocumentForm'

interface DocumentEditDrawerProps {
  document?: TDocument
  familyId?: string
  onClose: () => void
  isOpen: boolean
  onSuccess?: (documentId: string) => void
  canModify?: boolean
  taxonomy?: any
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
  console.log('document', document)
  console.log('familyId', familyId)
  console.log('taxonomy', taxonomy)

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
