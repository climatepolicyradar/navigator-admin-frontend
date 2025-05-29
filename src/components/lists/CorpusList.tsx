import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from '@chakra-ui/icons'
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
  SkeletonText,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { GoPencil } from 'react-icons/go'
import { Link } from 'react-router-dom'

import useCorpora from '@/hooks/useCorpora'
import { ICorpus, IError } from '@/interfaces'
import { sortBy } from '@/utils/sortBy'

import { Loader } from '../Loader'
import { ApiError } from '../feedback/ApiError'

export default function CorpusList() {
  const [sortControls, setSortControls] = useState<{
    key: keyof ICorpus
    reverse: boolean
  }>({ key: 'import_id', reverse: false })
  const [filteredItems, setFilteredItems] = useState<ICorpus[]>()
  const { corpora, loading, error } = useCorpora()
  const [corpusError] = useState<string | null | undefined>()
  const [formError] = useState<IError | null | undefined>()

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
                  <Th
                    onClick={() => handleHeaderClick('title')}
                    cursor='pointer'
                  >
                    Title {renderSortIcon('title')}
                  </Th>
                  <Th
                    onClick={() => handleHeaderClick('organisation_name')}
                    cursor='pointer'
                  >
                    Organisation {renderSortIcon('organisation_name')}
                  </Th>
                  <Th>Corpus Type</Th>
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
                    <Td>{corpus.title}</Td>
                    <Td>{corpus.organisation_name}</Td>
                    <Td>{corpus.corpus_type_name}</Td>
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
