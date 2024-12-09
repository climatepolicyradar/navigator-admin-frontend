import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ModalCloseButton,
} from '@chakra-ui/react'

type TProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const UnsavedChangesModal = ({ isOpen, onClose, onConfirm }: TProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Are you sure you want to leave?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Changes that you made may not be saved.</ModalBody>
        <ModalFooter>
          <Button colorScheme='gray' mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme='red' onClick={onConfirm}>
            Leave without saving
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
