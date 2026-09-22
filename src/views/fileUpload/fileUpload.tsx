import { useCallback, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent, KeyboardEvent } from 'react'
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Progress,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FiCheckCircle, FiFileText, FiUploadCloud, FiX } from 'react-icons/fi'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

interface ValidationError {
  row: number
  field: string
  message: string
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((selectedFile: File): string | null => {
    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      return 'Only CSV files are supported.'
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      return 'The CSV file must be smaller than 50 MB.'
    }

    return null
  }, [])

  const handleFileSelect = useCallback(
    (selectedFile: File | undefined) => {
      if (!selectedFile) return

      const validationError = validateFile(selectedFile)

      if (validationError) {
        setFile(null)
        setStatus('error')
        setErrors([
          {
            row: 0,
            field: 'file',
            message: validationError,
          },
        ])
        return
      }

      setFile(selectedFile)
      setStatus('idle')
      setErrors([])
    },
    [validateFile],
  )

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files?.[0])
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)

    if (status === 'uploading') return

    handleFileSelect(event.dataTransfer.files?.[0])
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    if (status !== 'uploading') {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const openFilePicker = () => {
    if (status !== 'uploading') {
      fileInputRef.current?.click()
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openFilePicker()
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'

    const units = ['Bytes', 'KB', 'MB', 'GB']
    const index = Math.floor(Math.log(bytes) / Math.log(1024))

    return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`
  }

  const handleUpload = async (): Promise<void> => {
    if (!file) return

    setStatus('uploading')
    setErrors([])

    try {
      // TODO: wire up to admin backend upload endpoint
      //
      // const formData = new FormData()
      // formData.append('file', file)
      //
      // await fetch('/api/csv-upload', {
      //   method: 'POST',
      //   body: formData,
      // })

      // Temporary until the API is connected.
      setStatus('success')
    } catch {
      setStatus('error')
      setErrors([
        {
          row: 0,
          field: 'upload',
          message: 'Upload failed. Please try again.',
        },
      ])
    }
  }

  const resetUpload = () => {
    setFile(null)
    setStatus('idle')
    setErrors([])
    setIsDragging(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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

      {/* Main upload area */}
      <Flex flex='1' align='center' justify='center' w='100%' py={8}>
        <Box w='100%' maxW='720px'>
          <VStack align='stretch' spacing={4}>
            {/* Drop zone */}
            <Box
              role='button'
              tabIndex={status === 'uploading' ? -1 : 0}
              aria-label='Upload CSV file'
              aria-disabled={status === 'uploading'}
              onClick={openFilePicker}
              onKeyDown={handleKeyDown}
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
                status === 'uploading'
                  ? 'not-allowed'
                  : isDragging
                    ? 'copy'
                    : 'pointer'
              }
              borderColor={
                status === 'uploading'
                  ? 'gray.200'
                  : isDragging
                    ? 'blue.500'
                    : 'gray.300'
              }
              bg={
                status === 'uploading'
                  ? 'gray.50'
                  : isDragging
                    ? 'blue.50'
                    : 'gray.50'
              }
              opacity={status === 'uploading' ? 0.7 : 1}
              transform={isDragging ? 'scale(1.01)' : 'scale(1)'}
              boxShadow={isDragging ? 'md' : 'none'}
              _hover={
                status === 'uploading'
                  ? undefined
                  : {
                      borderColor: isDragging ? 'blue.500' : 'blue.400',
                      bg: isDragging ? 'blue.50' : 'blue.50',
                      boxShadow: 'sm',
                    }
              }
              _focusVisible={{
                outline: 'none',
                boxShadow: 'outline',
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
                  status !== 'uploading' && !isDragging
                    ? { bg: 'blue.100', color: 'blue.600' }
                    : undefined
                }
              >
                <Icon as={FiUploadCloud} boxSize={7} />
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
                isDisabled={status === 'uploading'}
                onClick={(event) => {
                  event.stopPropagation()
                  openFilePicker()
                }}
              >
                Browse files
              </Button>

              <Text mt={4} fontSize='xs' color='gray.400'>
                CSV files only · Maximum 50 MB
              </Text>

              <input
                ref={fileInputRef}
                type='file'
                accept='.csv,text/csv'
                hidden
                onChange={handleInputChange}
              />
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
                    <Icon as={FiFileText} boxSize={5} />
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

                  {status !== 'uploading' && (
                    <Button
                      aria-label='Remove file'
                      size='sm'
                      variant='ghost'
                      onClick={resetUpload}
                    >
                      <Icon as={FiX} boxSize={4} />
                    </Button>
                  )}
                </Flex>

                {status === 'uploading' && (
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
                  onClick={handleUpload}
                  isDisabled={status === 'uploading'}
                  isLoading={status === 'uploading'}
                  loadingText='Uploading'
                >
                  Upload CSV
                </Button>
              </Flex>
            )}

            {/* Success */}
            {status === 'success' && (
              <Alert status='success' borderRadius='lg'>
                <AlertIcon as={FiCheckCircle} />

                <Box>
                  <Text fontWeight='medium'>Upload successful</Text>

                  <Text fontSize='sm' color='gray.600'>
                    Your CSV file has been uploaded successfully.
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
                      {error.row > 0 && (
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
