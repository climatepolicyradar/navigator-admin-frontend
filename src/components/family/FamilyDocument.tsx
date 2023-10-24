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
  onEdit?: (document: IDocument) => void
  onDelete?: (documentId: string) => void
}

export const FamilyDocument = ({ documentId, onEdit, onDelete }: TProps) => {
  const { document, loading, error } = useDocument(documentId)

  const handleEditClick = () => {
    onEdit && document ? onEdit(document) : null
  }

  const handleDeleteClick = () => {
    onDelete && onDelete(documentId)
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
      {(!!onEdit || !!onDelete) && (
        <CardFooter>
          <Stack direction="row" spacing={4}>
            {!!onEdit && <Button size='sm' onClick={handleEditClick}>Edit</Button>}
            {!!onDelete && (
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
