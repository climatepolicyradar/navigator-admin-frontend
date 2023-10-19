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
import { ApiError } from './feedback/ApiError'
import { IDocument } from '@/interfaces'

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
    return <ApiError error={error} />
  }

  return (
    <Card direction="row">
      <CardBody>
        <Text mb="2">{document?.title}</Text>
        <HStack divider={<Text>·</Text>} spacing={4}>
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
            {!!onEdit && <Button onClick={handleEditClick}>Edit</Button>}
            {!!onDelete && (
              <Button onClick={handleDeleteClick} colorScheme="red">
                Delete
              </Button>
            )}
          </Stack>
        </CardFooter>
      )}
    </Card>
  )
}
