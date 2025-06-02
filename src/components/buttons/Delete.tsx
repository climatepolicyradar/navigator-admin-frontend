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
import { useRef } from 'react'
import { GoX } from 'react-icons/go'

interface IProps {
  entityName: string
  entityTitle: string
  isDisabled?: boolean
  callback?: () => void
}

export const DeleteButton = ({
  entityName,
  entityTitle,
  isDisabled,
  callback,
}: IProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)

  const handleConfirmClick = () => {
    if (callback) callback()
    onClose()
  }

  return (
    <>
      <Tooltip label='Delete'>
        <IconButton
          aria-label='Edit'
          icon={<GoX />}
          variant='outline'
          size='sm'
          colorScheme='red'
          onClick={onOpen}
        />
      </Tooltip>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Delete {entityName}?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Please confirm that you want to delete this {entityName}:
            <br />
            <strong>{entityTitle}</strong>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Tooltip
              label="You don't have the required permissions"
              isDisabled={!isDisabled}
            >
              <Button
                isDisabled={isDisabled}
                colorScheme='red'
                ml={3}
                onClick={handleConfirmClick}
              >
                Yes
              </Button>
            </Tooltip>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
