import { IDocument } from '@/interfaces'
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

type TProps = {
  editingDocument?: IDocument
  onClose: () => void
  isOpen: boolean
}

export const DocumentEditDrawer = ({
  editingDocument,
  onClose,
  isOpen,
  children,
}: PropsWithChildren<TProps>) => {
  return (
    <Drawer placement='right' onClose={onClose} isOpen={isOpen} size='lg'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth='1px'>
          {editingDocument
            ? `Edit: ${editingDocument.title}`
            : 'Add new Document'}
        </DrawerHeader>
        <DrawerBody>{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
