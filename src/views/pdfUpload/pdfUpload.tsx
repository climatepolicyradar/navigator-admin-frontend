import { useId, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Code,
  Flex,
  Heading,
  IconButton,
  List,
  ListItem,
  Progress,
  Text,
  VStack,
  VisuallyHidden,
  chakra,
  useClipboard,
} from '@chakra-ui/react'
import {
  FiAlertCircle,
  FiCheck,
  FiCheckCircle,
  FiCopy,
  FiFileText,
  FiUploadCloud,
  FiX,
} from 'react-icons/fi'
import { IError } from '@/interfaces'
import type { UploadError } from '@/interfaces/UploadError'
import { uploadPdfs } from '@/api/PDFUpload'

import {
  validatePdfFiles,
  MAX_PDF_FILES_PER_REQUEST,
} from '@/utils/validatePDFDocument'

type UploadStatus = 'idle' | 'validating' | 'uploading'
type FileState = 'ready' | 'uploading' | 'success' | 'error'

interface SelectedFile {
  id: string
  file: File
  state: FileState
  progress: number
  key?: string
  error?: string
}

const STATE_BADGE: Record<FileState, { label: string; colorScheme: string }> = {
  ready: { label: 'Ready', colorScheme: 'gray' },
  uploading: { label: 'Uploading', colorScheme: 'blue' },
  success: { label: 'Uploaded', colorScheme: 'green' },
  error: { label: 'Failed', colorScheme: 'red' },
}

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

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? '' : 's'}`

function CopyKeyButton({ value }: { value: string }) {
  const { hasCopied, onCopy } = useClipboard(value)

  return (
    <IconButton
      aria-label={hasCopied ? 'Key copied' : `Copy key ${value}`}
      icon={hasCopied ? <FiCheck size={14} /> : <FiCopy size={14} />}
      size='xs'
      variant='ghost'
      onClick={onCopy}
    />
  )
}

interface FileRowProps {
  item: SelectedFile
  onRemove: (id: string) => void
}

function FileRow({ item, onRemove }: FileRowProps) {
  const { file, state, progress, key, error } = item
  const badge = STATE_BADGE[state]

  const icon =
    state === 'success' ? (
      <FiCheckCircle size={20} />
    ) : state === 'error' ? (
      <FiAlertCircle size={20} />
    ) : (
      <FiFileText size={20} />
    )

  const iconColors =
    state === 'success'
      ? { bg: 'green.50', color: 'green.600' }
      : state === 'error'
        ? { bg: 'red.50', color: 'red.600' }
        : { bg: 'blue.50', color: 'blue.600' }

  return (
    <ListItem
      border='1px solid'
      borderColor={state === 'error' ? 'red.200' : 'gray.200'}
      borderRadius='xl'
      bg='white'
      px={5}
      py={4}
      shadow='sm'
    >
      <Flex align='center' gap={4}>
        <Box
          aria-hidden='true'
          flexShrink={0}
          display='flex'
          alignItems='center'
          justifyContent='center'
          w={11}
          h={11}
          borderRadius='lg'
          {...iconColors}
        >
          {icon}
        </Box>

        <Box minW={0} flex={1}>
          <Flex align='center' gap={2}>
            <Text
              fontSize='sm'
              fontWeight='semibold'
              noOfLines={1}
              title={file.name}
            >
              {file.name}
            </Text>

            <Badge
              colorScheme={badge.colorScheme}
              variant='subtle'
              flexShrink={0}
            >
              {badge.label}
            </Badge>
          </Flex>

          <Text mt={1} fontSize='xs' color='gray.600'>
            {formatFileSize(file.size)}
          </Text>
        </Box>

        {state !== 'uploading' && (
          <IconButton
            aria-label={`Remove ${file.name}`}
            icon={<FiX size={20} />}
            size='sm'
            variant='ghost'
            onClick={() => onRemove(item.id)}
          />
        )}
      </Flex>

      {state === 'uploading' && (
        <Progress
          mt={4}
          size='xs'
          value={progress}
          isIndeterminate={progress === 0}
          colorScheme='blue'
          borderRadius='full'
          aria-label={`Uploading ${file.name}`}
        />
      )}

      {state === 'error' && error && (
        <Text mt={3} fontSize='sm' color='red.600'>
          {error}
        </Text>
      )}

      {state === 'success' && key && (
        <Flex mt={3} align='center' gap={2}>
          <Text fontSize='xs' color='gray.600' flexShrink={0}>
            Stored as
          </Text>
          <Code fontSize='xs' noOfLines={1} minW={0}>
            {key}
          </Code>
          <CopyKeyButton value={key} />
        </Flex>
      )}
    </ListItem>
  )
}

export default function PDFUpload() {
  const [items, setItems] = useState<SelectedFile[]>([])
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [errors, setErrors] = useState<UploadError[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const inputId = useId()
  const helpTextId = useId()

  const isUploading = status === 'uploading'
  const isValidating = status === 'validating'
  const isBusy = isUploading || isValidating

  const pending = items.filter(
    (item) => item.state === 'ready' || item.state === 'error',
  )
  const excess = pending.length - MAX_PDF_FILES_PER_REQUEST
  const allUploaded =
    items.length > 0 && items.every((item) => item.state === 'success')
  const canUpload = pending.length > 0 && excess <= 0 && !isBusy

  const retryOnly =
    pending.length > 0 && pending.every((i) => i.state === 'error')
  const uploadLabel = retryOnly
    ? 'Retry failed uploads'
    : `Upload ${plural(pending.length, 'PDF')}`

  const announcement = isValidating
    ? 'Checking files'
    : isUploading
      ? 'Uploading files'
      : allUploaded
        ? `${plural(items.length, 'file')} uploaded`
        : ''

  const patchItems = (ids: string[], patch: Partial<SelectedFile>) =>
    setItems((prev) =>
      prev.map((item) =>
        ids.includes(item.id) ? { ...item, ...patch } : item,
      ),
    )

  const handleFilesSelected = async (selected: File[]) => {
    if (!selected.length || isBusy) return

    setStatus('validating')
    setErrors([])

    const names = new Set(items.map((item) => item.file.name))
    const accepted: SelectedFile[] = []
    const rejections: UploadError[] = []

    for (const file of selected) {
      if (names.has(file.name)) {
        rejections.push({
          field: 'file',
          message: `${file.name} is already selected.`,
        })
        continue
      }

      const fileError = await validatePdfFiles([file])
      if (fileError) {
        rejections.push({ field: 'file', message: fileError })
        continue
      }

      names.add(file.name)
      accepted.push({
        id: file.name,
        file,
        state: 'ready',
        progress: 0,
      })
    }

    setItems((prev) => [...prev, ...accepted])
    setErrors(rejections)
    setStatus('idle')
  }

  const handleUpload = async (): Promise<void> => {
    if (!canUpload) return

    const batch = pending
    const ids = batch.map((item) => item.id)

    setStatus('uploading')
    setErrors([])
    patchItems(ids, { state: 'uploading', progress: 0, error: undefined })

    try {
      const results = await uploadPdfs(
        batch.map((item) => item.file),
        (index, fraction) =>
          patchItems([ids[index]], { progress: Math.round(fraction * 100) }),
      )

      results.forEach((result, index) => {
        patchItems(
          [ids[index]],
          result.error
            ? { state: 'error', error: result.error }
            : { state: 'success', progress: 100, key: result.key },
        )
      })
    } catch (error) {
      patchItems(ids, { state: 'ready', progress: 0 })
      const { detail } = error as IError
      setErrors([
        {
          field: 'upload',
          message:
            typeof detail === 'string' && detail
              ? detail
              : 'Upload failed. Check your connection and try again.',
        },
      ])
    } finally {
      setStatus('idle')
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? [])
    event.target.value = ''
    void handleFilesSelected(selected)
  }

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = isBusy ? 'none' : 'copy'

    if (!isBusy) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()

    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return
    }

    setIsDragging(false)
  }

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(false)
    if (isBusy) return
    void handleFilesSelected(Array.from(event.dataTransfer.files))
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    setErrors([])
  }

  const clearAll = () => {
    setItems([])
    setErrors([])
  }

  return (
    <Flex direction='column' w='100%' h='100%' px={6} py={6}>
      <Box>
        <Heading as='h1' size='lg'>
          PDF Upload
        </Heading>

        <Text mt={1} fontSize='sm' color='gray.600'>
          Drag and drop PDF files below, or browse your computer to upload them.
        </Text>
      </Box>

      <VisuallyHidden role='status' aria-live='polite'>
        {announcement}
      </VisuallyHidden>

      <Flex flex='1' align='flex-start' justify='center' w='100%' py={8}>
        <Box w='100%' maxW='720px'>
          <VStack align='stretch' spacing={4}>
            <chakra.label
              htmlFor={inputId}
              data-group
              position='relative'
              display='flex'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              textAlign='center'
              minH='260px'
              w='full'
              px={6}
              py={10}
              borderWidth='2px'
              borderStyle='dashed'
              borderRadius='xl'
              transition='all 0.2s ease-out'
              cursor={isBusy ? 'not-allowed' : 'pointer'}
              borderColor={
                isBusy ? 'gray.200' : isDragging ? 'blue.500' : 'gray.300'
              }
              bg={isDragging ? 'blue.50' : 'gray.50'}
              opacity={isBusy ? 0.7 : 1}
              boxShadow={isDragging ? 'md' : 'none'}
              _hover={
                isBusy
                  ? undefined
                  : { borderColor: 'blue.400', bg: 'blue.50', boxShadow: 'sm' }
              }
              sx={{
                '&:has(input:focus-visible)': {
                  outline: '3px solid',
                  outlineColor: 'blue.500',
                  outlineOffset: '2px',
                },
                '@media (prefers-reduced-motion: reduce)': {
                  transition: 'none',
                },
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <chakra.input
                id={inputId}
                type='file'
                accept='.pdf,application/pdf'
                multiple
                disabled={isBusy}
                aria-describedby={helpTextId}
                onChange={handleInputChange}
                position='absolute'
                w='1px'
                h='1px'
                m='-1px'
                p={0}
                border={0}
                overflow='hidden'
                whiteSpace='nowrap'
                sx={{ clip: 'rect(0, 0, 0, 0)' }}
              />

              <Box
                aria-hidden='true'
                mb={5}
                display='flex'
                alignItems='center'
                justifyContent='center'
                h='14'
                w='14'
                borderRadius='full'
                transition='background-color 0.2s, color 0.2s'
                bg={isDragging ? 'blue.100' : 'gray.100'}
                color={isDragging ? 'blue.600' : 'gray.600'}
                _groupHover={
                  !isBusy && !isDragging
                    ? { bg: 'blue.100', color: 'blue.600' }
                    : undefined
                }
              >
                <FiUploadCloud size={28} />
              </Box>

              <Text fontSize='md' fontWeight='semibold'>
                {isDragging
                  ? 'Drop your PDFs here'
                  : 'Drag and drop your PDFs here'}
              </Text>

              <Text mt={1} fontSize='sm' color='gray.600'>
                or
              </Text>

              <Box
                as='span'
                mt={3}
                px={3}
                py={1.5}
                borderWidth='1px'
                borderColor='blue.600'
                borderRadius='md'
                color='blue.700'
                fontSize='sm'
                fontWeight='medium'
                _groupHover={isBusy ? undefined : { bg: 'blue.100' }}
              >
                Browse files
              </Box>

              <Text id={helpTextId} mt={4} fontSize='xs' color='gray.600'>
                PDF files only · Up to {MAX_PDF_FILES_PER_REQUEST} files at a
                time
              </Text>
            </chakra.label>

            {isValidating && (
              <Box>
                <Progress
                  size='xs'
                  isIndeterminate
                  colorScheme='blue'
                  borderRadius='full'
                  aria-label='Checking files'
                />
                <Text mt={2} fontSize='xs' color='gray.600' textAlign='center'>
                  Checking files…
                </Text>
              </Box>
            )}

            {items.length > 0 && (
              <>
                <Flex justify='space-between' align='center'>
                  <Text as='h2' fontSize='sm' fontWeight='semibold'>
                    {plural(items.length, 'file')} selected
                  </Text>

                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={clearAll}
                    isDisabled={isUploading}
                  >
                    Clear all
                  </Button>
                </Flex>

                <List spacing={3} aria-label='Selected PDF files'>
                  {items.map((item) => (
                    <FileRow key={item.id} item={item} onRemove={removeItem} />
                  ))}
                </List>
              </>
            )}

            {excess > 0 && (
              <Alert status='warning' borderRadius='lg'>
                <AlertIcon />
                <Box fontSize='sm'>
                  <Text fontWeight='medium'>Too many files</Text>
                  <Text>
                    You can upload up to {MAX_PDF_FILES_PER_REQUEST} PDFs at a
                    time. Remove {plural(excess, 'file')} to continue.
                  </Text>
                </Box>
              </Alert>
            )}

            {pending.length > 0 && (
              <Flex justify='center'>
                <Button
                  minW='160px'
                  colorScheme='blue'
                  onClick={() => void handleUpload()}
                  isDisabled={!canUpload}
                  isLoading={isUploading}
                  loadingText='Uploading'
                >
                  {uploadLabel}
                </Button>
              </Flex>
            )}

            {allUploaded && (
              <Alert status='success' borderRadius='lg'>
                <AlertIcon />
                <Box>
                  <Text fontWeight='medium'>Upload successful</Text>
                  <Text fontSize='sm' color='gray.700'>
                    {items.length === 1
                      ? 'Your PDF has been uploaded.'
                      : `Your ${items.length} PDFs have been uploaded.`}
                  </Text>
                </Box>
              </Alert>
            )}

            {errors.length > 0 && (
              <VStack align='stretch' spacing={2}>
                {errors.map((error, index) => (
                  <Alert
                    status='error'
                    borderRadius='lg'
                    key={`${error.field}-${index}`}
                  >
                    <AlertIcon />
                    <Box fontSize='sm'>{error.message}</Box>
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
