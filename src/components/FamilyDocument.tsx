import useDocument from '@/hooks/useDocument'
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Text,
  Stack,
  Spinner,
  Flex,
} from '@chakra-ui/react'
import { ApiError } from './feedback/ApiError'

type TProps = {
  documentId: string
  onEdit?: (documentId: string) => void
  onDelete?: (documentId: string) => void
}

export const FamilyDocument = ({ documentId, onEdit, onDelete }: TProps) => {
  const { document, loading, error } = useDocument(documentId)

  const handleEditClick = () => {
    console.log('edit: ', documentId)
    onEdit && onEdit(documentId)
  }

  const handleDeleteClick = () => {
    console.log('delete: ', documentId)
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
        <Flex direction="column">
          {document?.role && <Text>Role: {document.role}</Text>}
        </Flex>
      </CardBody>
      {onEdit && onDelete && (
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
