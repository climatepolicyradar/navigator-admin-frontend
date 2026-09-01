import { useRef, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react'
import { getUploadUrl } from '@/api/Corpora'

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024
const ACCEPTED_MIME_TYPE = 'image/png'

type TProps = {
  corpusId: string
  currentImageUrl: string | null
  onImageChange: (newImageUrl: string) => void
}

export const CorpusImageUpload = ({
  corpusId,
  currentImageUrl,
  onImageChange,
}: TProps) => {
  const [validationError, setValidationError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null)
    setValidationError(null)

    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (file.type !== ACCEPTED_MIME_TYPE) {
      setValidationError('Only PNG images are supported.')
      resetFileInput()
      return
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError('Image must be 2MB or smaller.')
      resetFileInput()
      return
    }

    setPendingFile(file)
  }

  const handleCancel = () => {
    setPendingFile(null)
    resetFileInput()
  }

  const handleConfirm = async () => {
    if (!pendingFile) {
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const { response } = await getUploadUrl(corpusId)

      const putResponse = await fetch(response.presigned_upload_url, {
        method: 'PUT',
        headers: { 'Content-Type': ACCEPTED_MIME_TYPE },
        body: pendingFile,
      })

      if (!putResponse.ok) {
        throw new Error(`S3 upload failed with status ${putResponse.status}`)
      }

      onImageChange(response.object_cdn_url)
      setPendingFile(null)
      resetFileInput()
    } catch (error) {
      console.error('❌ Error uploading corpus image:', error)
      setUploadError('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <FormControl>
      <FormLabel htmlFor='corpus-image-upload-input'>Corpus Image</FormLabel>
      <VStack align='stretch' gap='2'>
        {currentImageUrl ? (
          <Image
            src={currentImageUrl}
            alt='Corpus logo'
            maxH='150px'
            maxW='300px'
            objectFit='contain'
          />
        ) : (
          <Box
            borderWidth='1px'
            borderStyle='dashed'
            borderRadius='md'
            p={4}
            textAlign='center'
          >
            <Text color='gray.500'>No image uploaded</Text>
          </Box>
        )}

        <input
          id='corpus-image-upload-input'
          ref={fileInputRef}
          type='file'
          accept='image/png'
          aria-label='Upload image'
          onChange={handleFileSelected}
        />

        {validationError && <Text color='red.500'>{validationError}</Text>}
        {uploadError && <Text color='red.500'>{uploadError}</Text>}
      </VStack>

      <Modal isOpen={!!pendingFile} onClose={handleCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Replace corpus image?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Uploading this image will replace the existing corpus image
              immediately and cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={() => void handleConfirm()}
              isLoading={isUploading}
            >
              Confirm
            </Button>
            <Button variant='ghost' onClick={handleCancel}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormControl>
  )
}
