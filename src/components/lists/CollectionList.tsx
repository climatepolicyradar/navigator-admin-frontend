import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { deleteCollection } from '@/api/Collections'
import { ICollection, IError } from '@/interfaces'
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
} from '@chakra-ui/react'
import { GoPencil } from 'react-icons/go'

import { DeleteButton } from '../buttons/Delete'
import useCollections from '@/hooks/useCollections'
import { Loader } from '../Loader'
import { sortBy } from '@/utils/sortBy'
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from '@chakra-ui/icons'
import { ApiError } from '../feedback/ApiError'

export default function CollectionList() {
  const [sortControls, setSortControls] = useState<{
    key: keyof ICollection
    reverse: boolean
  }>({ key: 'import_id', reverse: false })
  const [filteredItems, setFilteredItems] = useState<ICollection[]>()
  const [searchParams] = useSearchParams()
  const { collections, loading, error, reload } = useCollections(
    searchParams.get('q') ?? '',
  )
  const toast = useToast()
  const [collectionError, setCollectionError] = useState<
    string | null | undefined
  >()
  const [formError, setFormError] = useState<IError | null | undefined>()

  const renderSortIcon = (key: keyof ICollection) => {
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
        reload()
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

  const handleHeaderClick = (key: keyof ICollection) => {
    if (sortControls.key === key) {
      setSortControls({ key, reverse: !sortControls.reverse })
    } else {
      setSortControls({ key, reverse: false })
    }
  }

  useEffect(() => {
    const sortedItems = collections
      .slice()
      .sort(sortBy(sortControls.key, sortControls.reverse))
    setFilteredItems(sortedItems)
  }, [sortControls, collections])

  useEffect(() => {
    setFilteredItems(collections)
  }, [collections])

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
                  {/* <Th onClick={() => handleHeaderClick('import_id')}>ID</Th> */}
                  <Th
                    onClick={() => handleHeaderClick('title')}
                    cursor="pointer"
                  >
                    Title {renderSortIcon('title')}
                  </Th>
                  <Th
                    onClick={() => handleHeaderClick('organisation')}
                    cursor="pointer"
                  >
                    Organisation {renderSortIcon('organisation')}
                  </Th>
                  <Th>Families</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredItems?.length === 0 && (
                  <Tr>
                    <Td colSpan={4}>
                      No results found, please amend your search
                    </Td>
                  </Tr>
                )}
                {filteredItems?.map((collection) => (
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
                    {/* <Td>{collection.import_id}</Td> */}
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
