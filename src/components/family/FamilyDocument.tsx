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
} from '@chakra-ui/react'
import { ApiError } from '../feedback/ApiError'
import { IDocument } from '@/interfaces'
import { DeleteButton } from '../buttons/Delete'

type TProps = {
  documentId: string
  onEditClick?: (document: IDocument) => void
  onDeleteClick?: (documentId: string) => void
}

export const FamilyDocument = ({
  documentId,
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
      <Card direction="row">
        <ApiError error={error} />
      </Card>
    )
  }

  return (
    <Card direction="row">
      <CardBody>
        <Text mb="2">{document?.title}</Text>
        <HStack divider={<Text>·</Text>} gap={4}>
          {document?.role && <Text>Role: {document.role}</Text>}
          {document?.type && <Text>Type: {document.type}</Text>}
          {document?.variant_name && (
            <Text>Variant: {document.variant_name}</Text>
          )}
        </HStack>
      </CardBody>
      {(!!onEditClick || !!onDeleteClick) && (
        <CardFooter>
          <Stack direction="row" spacing={4}>
            {!!onEditClick && (
              <Button size="sm" onClick={handleEditClick}>
                Edit
              </Button>
            )}
            {!!onDeleteClick && (
              <DeleteButton
                entityName="document"
                entityTitle={document?.title || ''}
                callback={handleDeleteClick}
              />
            )}
          </Stack>
        </CardFooter>
      )}
    </Card>
  )
}
