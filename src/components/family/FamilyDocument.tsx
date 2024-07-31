import useDocument from '@/hooks/useDocument'
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Text,
  Stack,
  HStack,
  Spinner,
  Badge,
} from '@chakra-ui/react'
import { ApiError } from '../feedback/ApiError'
import { IDocument } from '@/interfaces'
import { DeleteButton } from '../buttons/Delete'
import { getStatusColour } from '@/utils/getStatusColour'

type TProps = {
  documentId: string
  canModify: boolean
  onEditClick?: (document: IDocument) => void
  onDeleteClick?: (documentId: string) => void
}

export const FamilyDocument = ({
  documentId,
  canModify,
  onEditClick,
  onDeleteClick,
}: TProps) => {
  const { document, loading, error } = useDocument(documentId)

  const handleEditClick = () => {
    onEditClick && document ? onEditClick(document) : null
  }

  const handleDeleteClick = () => {
    onDeleteClick && onDeleteClick(documentId)
  }

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return (
      <Card direction='row'>
        <ApiError error={error} />
      </Card>
    )
  }

  if (document && document.status.toLowerCase() === 'deleted') {
    return null
  }

  return (
    <Card direction='row'>
      <CardBody>
        <Text mb='2'>{document?.title}</Text>
        <HStack divider={<Text>·</Text>} gap={4}>
          {document?.metadata?.role && (
            <Text>Role: {document.metadata.role}</Text>
          )}
          {document?.metadata?.type && (
            <Text>Type: {document.metadata.type}</Text>
          )}
          {document?.variant_name && (
            <Text>Variant: {document.variant_name}</Text>
          )}
        </HStack>
        <Badge colorScheme={getStatusColour(document?.status)} size='sm'>
          {document?.status}
        </Badge>
      </CardBody>
      {(!!onEditClick || !!onDeleteClick) && (
        <CardFooter>
          {document?.status.toLowerCase() !== 'deleted' && (
            <Stack direction='row' spacing={4}>
              {!!onEditClick && (
                <Button
                  size='sm'
                  onClick={handleEditClick}
                  data-testid={`edit-${documentId}`}
                >
                  Edit
                </Button>
              )}
              {!!onDeleteClick && (
                <DeleteButton
                  isDisabled={!canModify}
                  entityName='document'
                  entityTitle={document?.title || ''}
                  callback={handleDeleteClick}
                />
              )}
            </Stack>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
