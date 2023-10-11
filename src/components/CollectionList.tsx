import { Link, useSearchParams } from 'react-router-dom'
import { deleteCollection } from '@/api/Collections'
import { IError } from '@/interfaces'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Box,
  HStack,
  Text,
  Tooltip,
  useToast,
  SkeletonText,
} from '@chakra-ui/react'
import { GoPencil } from 'react-icons/go'

import { DeleteButton } from './buttons/Delete'
import { useState } from 'react'
import useCollections from '@/hooks/useCollections'
import { Loader } from './Loader'

export default function CollectionList() {
  const [searchParams] = useSearchParams()
  const { collections, loading, error } = useCollections(
    searchParams.get('q') ?? '',
  )
  const toast = useToast()
  const [collectionError, setCollectionError] = useState<
    string | null | undefined
  >()
  const [formError, setFormError] = useState<IError | null | undefined>()

  const handleDeleteClick = async (id: string) => {
    setFormError(null)
    setCollectionError(null)

    toast({
      title: 'Collection deletion in progress',
      status: 'info',
      position: 'top',
    })
    await deleteCollection(id)
      .then(() => {
        toast({
          title: 'Collection has been successful deleted',
          status: 'success',
          position: 'top',
        })
      })
      .catch((error: IError) => {
        setCollectionError(id)
        setFormError(error)
        toast({
          title: 'Collection has not been deleted',
          description: error.message,
          status: 'error',
          position: 'top',
        })
      })
  }

  return (
    <>
      {loading && (
        <Box padding="4" bg="white">
          <Loader />
          <SkeletonText mt="4" noOfLines={3} spacing="4" skeletonHeight="2" />
        </Box>
      )}
      {!loading && (
        <Box flex={1}>
          <Box>
            {error && (
              <Box>
                <Text color={'red.500'}>{error.message}</Text>
                <Text fontSize="xs" color={'gray.500'}>
                  {error.detail}
                </Text>
              </Box>
            )}
            {formError && (
              <Box>
                <Text color={'red.500'}>{formError.message}</Text>
                <Text fontSize="xs" color={'gray.500'}>
                  {formError.detail}
                </Text>
              </Box>
            )}
          </Box>
          <TableContainer height={'100%'} whiteSpace={'normal'}>
            <Table size="sm" variant={'striped'}>
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Title</Th>
                  <Th>Organisation</Th>
                  <Th>Families</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {collections.map((collection) => (
                  <Tr
                    key={collection.import_id}
                    borderLeft={
                      collection.import_id === collectionError
                        ? '2px'
                        : 'inherit'
                    }
                    borderColor={
                      collection.import_id === collectionError
                        ? 'red.500'
                        : 'inherit'
                    }
                  >
                    <Td>{collection.import_id}</Td>
                    <Td>{collection.title}</Td>
                    <Td>{collection.organisation}</Td>
                    <Td>{collection.families.length}</Td>
                    <Td>
                      <HStack gap={2}>
                        <Tooltip label="Edit">
                          <Link to={`/collection/${collection.import_id}/edit`}>
                            <IconButton
                              aria-label="Edit document"
                              icon={<GoPencil />}
                              variant="outline"
                              size="sm"
                              colorScheme="blue"
                            />
                          </Link>
                        </Tooltip>
                        <DeleteButton
                          entityName="Collection"
                          entityTitle={collection.title}
                          callback={() =>
                            handleDeleteClick(collection.import_id)
                          }
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  )
}
