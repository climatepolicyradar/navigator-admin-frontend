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

import useCorpusTypes from '@/hooks/useCorpusTypes'
import { IError } from '@/interfaces'
import { ICorpusType } from '@/interfaces/CorpusType'
import { sortBy } from '@/utils/sortBy'

import { Loader } from '../Loader'
import { ApiError } from '../feedback/ApiError'

export default function CorpusTypeList() {
  const [sortControls, setSortControls] = useState<{
    key: keyof ICorpusType
    reverse: boolean
  }>({ key: 'name', reverse: false })
  const [filteredItems, setFilteredItems] = useState<ICorpusType[]>()
  const { corpusTypes, loading, error } = useCorpusTypes()
  const [corpusError] = useState<string | null | undefined>()
  const [formError] = useState<IError | null | undefined>()

  const renderSortIcon = (key: keyof ICorpusType) => {
    if (sortControls.key !== key) {
      return <ArrowUpDownIcon />
    }
    if (sortControls.reverse) {
      return <ArrowDownIcon />
    } else {
      return <ArrowUpIcon />
    }
  }

  const handleHeaderClick = (key: keyof ICorpusType) => {
    if (sortControls.key === key) {
      setSortControls({ key, reverse: !sortControls.reverse })
    } else {
      setSortControls({ key, reverse: false })
    }
  }

  useEffect(() => {
    if (corpusTypes) {
      const sortedItems = corpusTypes
        .slice()
        .sort(sortBy(sortControls.key, sortControls.reverse))
      setFilteredItems(sortedItems)
    } else {
      setFilteredItems([])
    }
  }, [sortControls, corpusTypes])

  useEffect(() => {
    setFilteredItems(corpusTypes)
  }, [corpusTypes])

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
                    onClick={() => handleHeaderClick('name')}
                    cursor='pointer'
                  >
                    Name {renderSortIcon('name')}
                  </Th>
                  <Th
                    onClick={() => handleHeaderClick('description')}
                    cursor='pointer'
                  >
                    Description {renderSortIcon('description')}
                  </Th>
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
                    key={corpus.name}
                    borderLeft={corpus.name === corpusError ? '2px' : 'inherit'}
                    borderColor={
                      corpus.name === corpusError ? 'red.500' : 'inherit'
                    }
                  >
                    <Td>{corpus.name}</Td>
                    <Td>{corpus.description}</Td>
                    <Td>
                      <HStack gap={2}>
                        <Tooltip label='Edit'>
                          <Link to={`/corpus-type/${corpus.name}/edit`}>
                            <IconButton
                              aria-label='Edit corpus type'
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
