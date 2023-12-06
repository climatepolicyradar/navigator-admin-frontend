import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { deleteDocument } from '@/api/Documents'
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
  Tooltip,
  useToast,
  SkeletonText,
  Badge,
} from '@chakra-ui/react'
import { GoPencil } from 'react-icons/go'

import { DeleteButton } from '../buttons/Delete'
import useDocuments from '@/hooks/useDocuments'
import { Loader } from '../Loader'
import { sortBy } from '@/utils/sortBy'
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from '@chakra-ui/icons'
import { getStatusColour } from '@/utils/getStatusColour'
import { ApiError } from '../feedback/ApiError'

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
      title: 'Document deletion in progress',
      status: 'info',
      position: 'top',
    })
    await deleteDocument(id)
      .then(() => {
        toast({
          title: 'Document has been successful deleted',
          status: 'success',
          position: 'top',
        })
        reload()
      })
      .catch((error: IError) => {
        setDocumentError(id)
        setFormError(error)
        toast({
          title: 'Document has not been deleted',
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
            {error && <ApiError error={error} />}
            {formError && <ApiError error={formError} />}
          </Box>
          <TableContainer height={'100%'} whiteSpace={'normal'}>
            <Table size="sm" variant={'striped'}>
              <Thead>
                <Tr>
                  <Th
                    onClick={() => handleHeaderClick('title')}
                    cursor="pointer"
                  >
                    Title {renderSortIcon('title')}
                  </Th>
                  <Th
                    onClick={() => handleHeaderClick('status')}
                    cursor="pointer"
                  >
                    Status {renderSortIcon('status')}
                  </Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredItems.length === 0 && (
                  <Tr>
                    <Td colSpan={3}>No results found, please amend your search</Td>
                  </Tr>
                )}
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
                    <Td>{document.title}</Td>
                    <Td>
                      <Badge
                        colorScheme={getStatusColour(document.status)}
                        size="sm"
                      >
                        {document.status}
                      </Badge>
                    </Td>
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
