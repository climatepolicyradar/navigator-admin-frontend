import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
// import { deleteCorpus } from '@/api/Corpora'
import { ICorpus, IError } from '@/interfaces'
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
import useCorpora from '@/hooks/useCorpora'
import { Loader } from '../Loader'
import { sortBy } from '@/utils/sortBy'
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from '@chakra-ui/icons'
import { ApiError } from '../feedback/ApiError'

export default function CorpusList() {
  const [sortControls, setSortControls] = useState<{
    key: keyof ICorpus
    reverse: boolean
  }>({ key: 'import_id', reverse: false })
  const [filteredItems, setFilteredItems] = useState<ICorpus[]>()
  const [searchParams] = useSearchParams()
  const { corpora, loading, error, reload } = useCorpora(
    searchParams.get('q') ?? '',
  )
  const toast = useToast()
  const [corpusError, setCorpusError] = useState<string | null | undefined>()
  const [formError, setFormError] = useState<IError | null | undefined>()

  const renderSortIcon = (key: keyof ICorpus) => {
    if (sortControls.key !== key) {
      return <ArrowUpDownIcon />
    }
    if (sortControls.reverse) {
      return <ArrowDownIcon />
    } else {
      return <ArrowUpIcon />
    }
  }

  // const handleDeleteClick = async (id: string) => {
  //   setFormError(null)
  //   setCorpusError(null)

  //   toast({
  //     title: 'Corpus deletion in progress',
  //     status: 'info',
  //     position: 'top',
  //   })
  //   await deleteCorpus(id)
  //     .then(() => {
  //       toast({
  //         title: 'Corpus has been successful deleted',
  //         status: 'success',
  //         position: 'top',
  //       })
  //       reload()
  //     })
  //     .catch((error: IError) => {
  //       setCorpusError(id)
  //       setFormError(error)
  //       toast({
  //         title: 'Corpus has not been deleted',
  //         description: error.message,
  //         status: 'error',
  //         position: 'top',
  //       })
  //     })
  // }

  const handleHeaderClick = (key: keyof ICorpus) => {
    if (sortControls.key === key) {
      setSortControls({ key, reverse: !sortControls.reverse })
    } else {
      setSortControls({ key, reverse: false })
    }
  }

  useEffect(() => {
    const sortedItems = corpora
      .slice()
      .sort(sortBy(sortControls.key, sortControls.reverse))
    setFilteredItems(sortedItems)
  }, [sortControls, corpora])

  useEffect(() => {
    setFilteredItems(corpora)
  }, [corpora])

  return (
    <>
      {loading && (
        <Box padding='4' bg='white'>
          <Loader />
          <SkeletonText mt='4' noOfLines={3} spacing='4' skeletonHeight='2' />
        </Box>
      )}
      {!loading && (
        <Box flex={1}>
          <Box>
            {error && <ApiError error={error} />}
            {formError && <ApiError error={formError} />}
          </Box>
          <TableContainer height={'100%'} whiteSpace={'normal'}>
            <Table size='sm' variant={'striped'}>
              <Thead>
                <Tr>
                  {/* <Th onClick={() => handleHeaderClick('import_id')}>ID</Th> */}
                  <Th
                    onClick={() => handleHeaderClick('title')}
                    cursor='pointer'
                  >
                    Title {renderSortIcon('title')}
                  </Th>
                  <Th
                    onClick={() => handleHeaderClick('organisation')}
                    cursor='pointer'
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
                {filteredItems?.map((corpus) => (
                  <Tr
                    key={corpus.import_id}
                    borderLeft={
                      corpus.import_id === corpusError ? '2px' : 'inherit'
                    }
                    borderColor={
                      corpus.import_id === corpusError ? 'red.500' : 'inherit'
                    }
                  >
                    {/* <Td>{corpus.import_id}</Td> */}
                    <Td>{corpus.title}</Td>
                    <Td>{corpus.organisation_name}</Td>
                    <Td>{corpus.description}</Td>
                    <Td>
                      <HStack gap={2}>
                        <Tooltip label='Edit'>
                          <Link to={`/corpus/${corpus.import_id}/edit`}>
                            <IconButton
                              aria-label='Edit corpus'
                              icon={<GoPencil />}
                              variant='outline'
                              size='sm'
                              colorScheme='blue'
                            />
                          </Link>
                        </Tooltip>
                        {/* <DeleteButton
                          entityName='Corpus'
                          entityTitle={corpus.title}
                          callback={() => handleDeleteClick(corpus.import_id)}
                        /> */}
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
