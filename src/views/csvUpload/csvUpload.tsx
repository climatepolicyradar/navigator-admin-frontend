import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Progress,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FiFileText, FiUploadCloud, FiX } from 'react-icons/fi'
import { IError } from '@/interfaces'
import { uploadCsv } from '@/api/CSVUpload'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

interface UploadError {
  /** CSV row the error relates to. Omitted for file-level errors. */
  row?: number
  field: string
  message: string
}

const MAX_FILE_SIZE_MB = 10
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

const UPLOAD_FAILED_MESSAGE =
  'Upload failed. Check your connection and try again.'

const formatFileSize = (bytes: number): string => {
  if (bytes <= 0) return '0 Bytes'

  const units = ['Bytes', 'KB', 'MB', 'GB']
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  )

  if (index === 0) return `${bytes} Bytes`

  return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`
}

const validateFile = (file: File): string | null => {
  if (!file.name.toLowerCase().endsWith('.csv')) {
    return 'Only CSV files are supported.'
  }

  if (file.size === 0) {
    return 'The CSV file is empty.'
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `The CSV file must be smaller than ${MAX_FILE_SIZE_MB} MB.`
  }

  return null
}

export default function CSVUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [errors, setErrors] = useState<UploadError[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const isUploading = status === 'uploading'

  const handleFileSelect = (selectedFile: File | undefined) => {
    if (!selectedFile) return

    const validationError = validateFile(selectedFile)

    if (validationError) {
      setFile(null)
      setStatus('error')
      setErrors([{ field: 'file', message: validationError }])
      return
    }

    setFile(selectedFile)
    setStatus('idle')
    setErrors([])
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files?.[0])

    // Clear the input so choosing the same file again still fires onChange.
    event.target.value = ''
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)

    if (isUploading) return

    handleFileSelect(event.dataTransfer.files?.[0])
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = isUploading ? 'none' : 'copy'

    if (!isUploading) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return
    }

    setIsDragging(false)
  }

  const openFilePicker = () => {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }

  const handleUpload = async (): Promise<void> => {
    if (!file) return

    setStatus('uploading')
    setErrors([])

    try {
      await uploadCsv(file)
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrors([
        {
          field: 'upload',
          message: (error as IError).message || UPLOAD_FAILED_MESSAGE,
        },
      ])
    }
  }

  const resetUpload = () => {
    setFile(null)
    setStatus('idle')
    setErrors([])
    setIsDragging(false)
  }

  return (
    <Flex direction='column' w='100%' h='100%' px={6} py={6}>
      {/* Page heading - top left */}
      <Box>
        <Heading as='h1' size='lg'>
          CSV Upload
        </Heading>

        <Text mt={1} fontSize='sm' color='gray.500'>
          Drag and drop a CSV file below, or browse your computer to upload one.
        </Text>
      </Box>

      {/* Kept outside the drop zone so its click events don't bubble into it */}
      <input
        ref={fileInputRef}
        type='file'
        accept='.csv,text/csv'
        hidden
        onChange={handleInputChange}
      />

      {/* Main upload area */}
      <Flex flex='1' align='center' justify='center' w='100%' py={8}>
        <Box w='100%' maxW='720px'>
          <VStack align='stretch' spacing={4}>
            {/* Drop zone */}
            <Box
              role='group'
              aria-label='CSV file drop zone'
              aria-disabled={isUploading}
              onClick={openFilePicker}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              position='relative'
              display='flex'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              textAlign='center'
              minH='300px'
              w='full'
              px={6}
              py={12}
              borderWidth='2px'
              borderStyle='dashed'
              borderRadius='xl'
              transition='all 0.2s ease-out'
              cursor={
                isUploading ? 'not-allowed' : isDragging ? 'copy' : 'pointer'
              }
              borderColor={
                isUploading ? 'gray.200' : isDragging ? 'blue.500' : 'gray.300'
              }
              bg={isDragging ? 'blue.50' : 'gray.50'}
              opacity={isUploading ? 0.7 : 1}
              transform={isDragging ? 'scale(1.01)' : 'scale(1)'}
              boxShadow={isDragging ? 'md' : 'none'}
              _hover={
                isUploading
                  ? undefined
                  : {
                      borderColor: isDragging ? 'blue.500' : 'blue.400',
                      bg: 'blue.50',
                      boxShadow: 'sm',
                    }
              }
              sx={{
                '@media (prefers-reduced-motion: reduce)': {
                  transition: 'none',
                  transform: 'none',
                },
              }}
            >
              {/* Upload icon */}
              <Box
                mb={5}
                display='flex'
                alignItems='center'
                justifyContent='center'
                h='14'
                w='14'
                borderRadius='full'
                transition='background-color 0.2s, color 0.2s'
                bg={isDragging ? 'blue.100' : 'gray.100'}
                color={isDragging ? 'blue.600' : 'gray.500'}
                _groupHover={
                  !isUploading && !isDragging
                    ? { bg: 'blue.100', color: 'blue.600' }
                    : undefined
                }
              >
                <FiUploadCloud size={28} />
              </Box>

              <Text fontSize='md' fontWeight='semibold'>
                {isDragging
                  ? 'Drop your CSV here'
                  : 'Drag and drop your CSV here'}
              </Text>

              <Text mt={1} fontSize='sm' color='gray.500'>
                or
              </Text>

              <Button
                mt={3}
                size='sm'
                variant='outline'
                colorScheme='blue'
                type='button'
                isDisabled={isUploading}
                onClick={(event) => {
                  event.stopPropagation()
                  openFilePicker()
                }}
              >
                Browse files
              </Button>

              <Text mt={4} fontSize='xs' color='gray.400'>
                CSV files only · Maximum {MAX_FILE_SIZE_MB} MB
              </Text>
            </Box>

            {/* Selected file */}
            {file && (
              <Box
                border='1px solid'
                borderColor='gray.200'
                borderRadius='xl'
                bg='white'
                px={5}
                py={4}
                shadow='sm'
              >
                <Flex align='center' gap={4}>
                  <Box
                    flexShrink={0}
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    w={11}
                    h={11}
                    borderRadius='lg'
                    bg='blue.50'
                    color='blue.600'
                  >
                    <FiFileText size={20} />
                  </Box>

                  <Box minW={0} flex={1}>
                    <Flex align='center' gap={2}>
                      <Text fontSize='sm' fontWeight='semibold' noOfLines={1}>
                        {file.name}
                      </Text>

                      <Badge colorScheme='blue' variant='subtle' flexShrink={0}>
                        CSV
                      </Badge>
                    </Flex>

                    <Text mt={1} fontSize='xs' color='gray.500'>
                      {formatFileSize(file.size)}
                    </Text>
                  </Box>

                  {!isUploading && (
                    <IconButton
                      aria-label='Remove file'
                      icon={<FiX size={20} />}
                      size='sm'
                      variant='ghost'
                      onClick={resetUpload}
                    />
                  )}
                </Flex>

                {isUploading && (
                  <Progress
                    mt={4}
                    size='xs'
                    isIndeterminate
                    colorScheme='blue'
                    borderRadius='full'
                  />
                )}
              </Box>
            )}

            {/* Upload button */}
            {file && status !== 'success' && (
              <Flex justify='center'>
                <Button
                  minW='140px'
                  colorScheme='blue'
                  onClick={() => void handleUpload()}
                  isDisabled={isUploading}
                  isLoading={isUploading}
                  loadingText='Uploading'
                >
                  Upload CSV
                </Button>
              </Flex>
            )}

            {/* Success */}
            {status === 'success' && (
              <Alert status='success' borderRadius='lg'>
                <AlertIcon />

                <Box>
                  <Text fontWeight='medium'>Upload successful</Text>

                  <Text fontSize='sm' color='gray.600'>
                    Your CSV file has been uploaded.
                  </Text>
                </Box>
              </Alert>
            )}

            {/* Errors */}
            {status === 'error' && errors.length > 0 && (
              <VStack align='stretch' spacing={2}>
                {errors.map((error, index) => (
                  <Alert
                    status='error'
                    borderRadius='lg'
                    key={`${error.field}-${index}`}
                  >
                    <AlertIcon />

                    <Box fontSize='sm'>
                      {error.row !== undefined && (
                        <Text as='span' fontWeight='bold'>
                          Row {error.row}:{' '}
                        </Text>
                      )}

                      {error.message}
                    </Box>
                  </Alert>
                ))}
              </VStack>
            )}
          </VStack>
        </Box>
      </Flex>
    </Flex>
  )
}
