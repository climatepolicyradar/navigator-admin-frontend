import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { deleteCollection } from '@/api/Collections'
import { IDocument, IError } from '@/interfaces'
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

import { DeleteButton } from '../buttons/Delete'
import useDocuments from '@/hooks/useDocuments'
import { Loader } from '../Loader'
import { sortBy } from '@/utils/sortBy'
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from '@chakra-ui/icons'

export default function DocumentList() {
  const [sortControls, setSortControls] = useState<{
    key: keyof IDocument
    reverse: boolean
  }>({ key: 'import_id', reverse: false })
  const [filteredItems, setFilteredItems] = useState<IDocument[]>([])
  const [searchParams] = useSearchParams()
  const { documents, loading, error, reload } = useDocuments(
    searchParams.get('q') ?? '',
  )
  const toast = useToast()
  const [documentError, setDocumentError] = useState<
    string | null | undefined
  >()
  const [formError, setFormError] = useState<IError | null | undefined>()

  const renderSortIcon = (key: keyof IDocument) => {
    if (sortControls.key !== key) {
      return <ArrowUpDownIcon />
    }
    if (sortControls.reverse) {
      return <ArrowDownIcon />
    } else {
      return <ArrowUpIcon />
    }
  }

  const handleDeleteClick = async (id: string) => {
    setFormError(null)
    setDocumentError(null)

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
        reload()
      })
      .catch((error: IError) => {
        setDocumentError(id)
        setFormError(error)
        toast({
          title: 'Collection has not been deleted',
          description: error.message,
          status: 'error',
          position: 'top',
        })
      })
  }

  const handleHeaderClick = (key: keyof IDocument) => {
    if (sortControls.key === key) {
      setSortControls({ key, reverse: !sortControls.reverse })
    } else {
      setSortControls({ key, reverse: false })
    }
  }

  useEffect(() => {
    const sortedItems = documents
      .slice()
      .sort(sortBy(sortControls.key, sortControls.reverse))
    setFilteredItems(sortedItems)
  }, [sortControls, documents])

  useEffect(() => {
    setFilteredItems(documents)
  }, [documents])

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
                  {/* <Th onClick={() => handleHeaderClick('import_id')}>ID</Th> */}
                  <Th
                    onClick={() => handleHeaderClick('title')}
                    cursor="pointer"
                  >
                    Title {renderSortIcon('title')}
                  </Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredItems.map((document) => (
                  <Tr
                    key={document.import_id}
                    borderLeft={
                      document.import_id === documentError ? '2px' : 'inherit'
                    }
                    borderColor={
                      document.import_id === documentError
                        ? 'red.500'
                        : 'inherit'
                    }
                  >
                    {/* <Td>{document.import_id}</Td> */}
                    <Td>{document.title}</Td>
                    <Td>
                      <HStack gap={2}>
                        <Tooltip label="Edit">
                          <Link to={`/document/${document.import_id}/edit`}>
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
                          entityName="document"
                          entityTitle={document.title}
                          callback={() => handleDeleteClick(document.import_id)}
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
