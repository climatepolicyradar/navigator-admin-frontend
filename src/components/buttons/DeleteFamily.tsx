import { useRef } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  Button,
  IconButton,
  Tooltip,
} from '@chakra-ui/react'
import { GoX } from 'react-icons/go'

interface IProps {
  callback?: () => void
}

export const DeleteFamily = ({ callback }: IProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)

  const handleConfirmClick = () => {
    if (callback) callback()
    onClose()
  }

  return (
    <>
      <Tooltip label="Delete">
        <IconButton
          aria-label="Edit document"
          icon={<GoX />}
          variant="outline"
          size="sm"
          colorScheme="red"
          onClick={onOpen}
        />
      </Tooltip>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Delete family?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete this family?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleConfirmClick}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
