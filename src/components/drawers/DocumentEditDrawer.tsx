import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react'
import { DocumentForm } from '../forms/DocumentForm'
import {
  IConfigTaxonomyCCLW,
  IConfigTaxonomyUNFCCC,
  IDocument,
} from '@/interfaces'

type TProps = {
  editingDocument?: IDocument
  loadedFamilyId: string
  canModify: boolean
  taxonomy?: IConfigTaxonomyCCLW | IConfigTaxonomyUNFCCC
  onSuccess?: (eventId: string) => void
  onClose: () => void
  isOpen: boolean
}

export const DocumentEditDrawer = ({
  editingDocument,
  loadedFamilyId,
  canModify,
  taxonomy,
  onSuccess,
  onClose,
  isOpen,
}: TProps) => {
  return (
    <Drawer placement='right' onClose={onClose} isOpen={isOpen} size='lg'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth='1px'>
          {editingDocument
            ? `Edit: ${editingDocument.title}`
            : 'Add new Document'}
        </DrawerHeader>
        <DrawerBody>
          <DocumentForm
            familyId={loadedFamilyId}
            canModify={canModify}
            taxonomy={taxonomy}
            onSuccess={onSuccess}
            document={editingDocument}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
