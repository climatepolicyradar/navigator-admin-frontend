import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
  Tooltip,
  SkeletonText,
} from '@chakra-ui/react'
import { GoPencil } from 'react-icons/go'

import { Loader } from '../Loader'
import { sortBy } from '@/utils/sortBy'
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from '@chakra-ui/icons'
import { ApiError } from '../feedback/ApiError'
import { IOrganisation } from '@/interfaces/Organisation'
import useOrganisations from '@/hooks/useOrganisations'

export default function OrganisationList() {
  const [sortControls, setSortControls] = useState<{
    key: keyof IOrganisation
    reverse: boolean
  }>({ key: 'display_name', reverse: false })
  const [filteredItems, setFilteredItems] = useState<IOrganisation[]>()
  const { organisations, loading, error } = useOrganisations()
  const [organisationError] = useState<string | null | undefined>()
  const [formError] = useState<IError | null | undefined>()

  const renderSortIcon = (key: keyof IOrganisation) => {
    if (sortControls.key !== key) {
      return <ArrowUpDownIcon />
    }
    if (sortControls.reverse) {
      return <ArrowDownIcon />
    } else {
      return <ArrowUpIcon />
    }
  }

  const handleHeaderClick = (key: keyof IOrganisation) => {
    if (sortControls.key === key) {
      setSortControls({ key, reverse: !sortControls.reverse })
    } else {
      setSortControls({ key, reverse: false })
    }
  }

  useEffect(() => {
    if (organisations) {
      const sortedItems = organisations
        .slice()
        .sort(sortBy(sortControls.key, sortControls.reverse))
      setFilteredItems(sortedItems)
    } else {
      setFilteredItems([])
    }
  }, [sortControls, organisations])

  useEffect(() => {
    setFilteredItems(organisations)
  }, [organisations])

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
                    onClick={() => handleHeaderClick('display_name')}
                    cursor='pointer'
                  >
                    Name {renderSortIcon('display_name')}
                  </Th>
                  <Th
                    onClick={() => handleHeaderClick('description')}
                    cursor='pointer'
                  >
                    Description {renderSortIcon('description')}
                  </Th>
                  <Th
                    onClick={() => handleHeaderClick('type')}
                    cursor='pointer'
                  >
                    Type {renderSortIcon('type')}
                  </Th>
                  <Th onClick={() => {}} cursor='pointer'>
                    Attribution Link {renderSortIcon('attribution_link')}
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
                {filteredItems?.map((org) => (
                  <Tr
                    key={org.display_name}
                    borderLeft={
                      org.display_name === organisationError ? '2px' : 'inherit'
                    }
                    borderColor={
                      org.display_name === organisationError
                        ? 'red.500'
                        : 'inherit'
                    }
                  >
                    <Td>{org.display_name}</Td>
                    <Td>{org.description}</Td>
                    <Td>{org.type}</Td>
                    <Td>{org.attribution_link}</Td>
                    <Td>
                      <HStack gap={2}>
                        <Tooltip label='Edit'>
                          <Link to={`/organisation/${org.id}/edit`}>
                            <IconButton
                              aria-label='Edit organisation'
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
