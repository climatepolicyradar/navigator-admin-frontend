import { useRef, useState } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Box,
  Button,
  Code,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useClipboard,
  useDisclosure,
} from '@chakra-ui/react'
import { resetUserPassword } from '@/api/Users'
import { ApiError } from '@/components/feedback/ApiError'
import { IError } from '@/interfaces'

interface IProps {
  email: string
}

export const ResetPasswordButton = ({ email }: IProps) => {
  const confirm = useDisclosure()
  const cancelRef = useRef(null)
  const [isResetting, setIsResetting] = useState(false)
  const [error, setError] = useState<IError | null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const { onCopy, hasCopied, setValue } = useClipboard('')

  const handleConfirmClick = async () => {
    setIsResetting(true)
    setError(null)
    try {
      const { response } = await resetUserPassword(email)
      setPassword(response)
      setValue(response)
    } catch (e) {
      setError(e as IError)
    } finally {
      setIsResetting(false)
      confirm.onClose()
    }
  }

  const handlePasswordModalClose = () => {
    setPassword(null)
    setValue('')
  }

  return (
    <>
      <Button colorScheme='red' variant='outline' onClick={confirm.onOpen}>
        Reset password
      </Button>
      {error && (
        <Box mt={4}>
          <ApiError error={error} />
        </Box>
      )}

      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={confirm.onClose}
        isOpen={confirm.isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Reset password?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            This will replace the current password for <strong>{email}</strong>{' '}
            with a newly generated one. They will no longer be able to log in
            with their old password.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={confirm.onClose}>
              Cancel
            </Button>
            <Button
              colorScheme='red'
              ml={3}
              onClick={handleConfirmClick}
              isLoading={isResetting}
            >
              Reset password
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Modal
        isOpen={password !== null}
        onClose={handlePasswordModalClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>
              Share this password with <strong>{email}</strong> securely. It
              will not be shown again once this window is closed.
            </Text>
            <Code
              p={2}
              display='block'
              whiteSpace='normal'
              wordBreak='break-all'
              aria-label='New password'
            >
              {password}
            </Code>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCopy} colorScheme='blue' mr={3}>
              {hasCopied ? 'Copied' : 'Copy password'}
            </Button>
            <Button onClick={handlePasswordModalClose}>Done</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
