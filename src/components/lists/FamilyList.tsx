import { useEffect, useState, useMemo } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { deleteFamily, getFamilies, TFamilySearchQuery } from '@/api/Families'
import { IError, TFamily } from '@/interfaces'
import { formatDate, formatDateTime } from '@/utils/formatDate'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Badge,
  Box,
  HStack,
  Tooltip,
  useToast,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Spinner,
} from '@chakra-ui/react'
import { GoPencil } from 'react-icons/go'
import { FiFilter } from 'react-icons/fi'
import { Select } from 'chakra-react-select'

import { DeleteButton } from '../buttons/Delete'
import { sortBy } from '@/utils/sortBy'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpDownIcon,
  WarningIcon,
} from '@chakra-ui/icons'
import { getStatusColour } from '@/utils/getStatusColour'
import { getStatusAlias } from '@/utils/getStatusAlias'
import { ApiError } from '../feedback/ApiError'
import { canModify } from '@/utils/canModify'
import { decodeToken } from '@/utils/decodeToken'
import useConfig from '@/hooks/useConfig'
import { getCountries } from '@/utils/extractNestedGeographyData'

interface ILoaderProps {
  request: {
    url: string
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ request }: ILoaderProps) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const geography = url.searchParams.get('geography')
  const status = url.searchParams.get('status')
  const searchQuery: TFamilySearchQuery = {
    query: q,
  }
  if (geography) {
    searchQuery['geography'] = geography
  }
  if (status) {
    searchQuery['status'] = status
  }
  const response = await getFamilies(searchQuery)
  return response
}

export default function FamilyList() {
  const [filteredItems, setFilteredItems] = useState<TFamily[]>()
  const [selectedGeographies, setSelectedGeographies] = useState<
    Array<{ value: string; label: string }>
  >([])
  const [sortControls, setSortControls] = useState<{
    key: keyof TFamily
    reverse: boolean
  }>({ key: 'title', reverse: false })
  const {
    response: { data: families },
  } = useLoaderData() as { response: { data: TFamily[] } }
  const { config, loading: configLoading } = useConfig()
  const toast = useToast()
  const [familyError, setFamilyError] = useState<string | null | undefined>()
  const [formError, setFormError] = useState<IError | null | undefined>()

  const userToken = useMemo(() => {
    const token = localStorage.getItem('token')
    if (!token) return null
    const decodedToken = decodeToken(token)
    return decodedToken
  }, [])

  const userAccess = !userToken ? null : userToken.authorisation
  const isSuperuser = !userToken ? false : userToken.is_superuser

  const handleDeleteClick = async (id: string) => {
    setFormError(null)
    setFamilyError(null)

    toast({
      title: 'Family deletion in progress',
      status: 'info',
      position: 'top',
    })
    await deleteFamily(id)
      .then(() => {
        toast({
          title: 'Family has been successful deleted',
          status: 'success',
          position: 'top',
        })
      })
      .catch((error: IError) => {
        setFamilyError(id)
        setFormError(error)
        toast({
          title: 'Family has not been deleted',
          description: error.message,
          status: 'error',
          position: 'top',
        })
      })
  }

  const renderSortIcon = (key: keyof TFamily) => {
    if (sortControls.key !== key) {
      return <ArrowUpDownIcon />
    }
    if (sortControls.reverse) {
      return <ArrowDownIcon />
    } else {
      return <ArrowUpIcon />
    }
  }

  const handleHeaderClick = (key: keyof TFamily) => {
    if (sortControls.key === key) {
      setSortControls({ key, reverse: !sortControls.reverse })
    } else {
      setSortControls({ key, reverse: false })
    }
  }

  useEffect(() => {
    // First filter by geography
    const geographyFiltered = families.filter((item) =>
      selectedGeographies.length === 0
        ? true
        : selectedGeographies.some(
            (selected) => selected.value === item.geography,
          ),
    )
    // Then sort the filtered results
    const sortedAndFiltered = geographyFiltered
      .slice()
      .sort(sortBy(sortControls.key, sortControls.reverse))
    setFilteredItems(sortedAndFiltered)
  }, [families, selectedGeographies, sortControls])

  // Get unique geographies from all families and map them to their display values
  const geographyOptions = useMemo(() => {
    if (!config) return []

    // Create a map of geography values to display values
    const geoMap = new Map<string, string>()
    const countries = getCountries(config.geographies)
    countries.forEach((country) => {
      geoMap.set(country.value, country.display_value)
    })

    // Get unique geographies from families and map to display values
    const geographies = new Set<string>()
    families.forEach((family) => {
      if (family.geography) {
        geographies.add(family.geography)
      }
    })

    return Array.from(geographies)
      .sort()
      .map((geography) => ({
        value: geography,
        label: geoMap.get(geography) || geography, // Fallback to the value if no display value found
      }))
  }, [families, config])

  return (
    <Box flex={1}>
      <Box>{formError && <ApiError error={formError} />}</Box>
      <TableContainer height={'100%'} whiteSpace={'normal'}>
        <Table size='sm' variant={'striped'}>
          <Thead>
            <Tr>
              <Th onClick={() => handleHeaderClick('title')} cursor='pointer'>
                <Flex gap={2} align='center'>
                  Title {renderSortIcon('title')}
                </Flex>
              </Th>
              <Th
                onClick={() => handleHeaderClick('category')}
                cursor='pointer'
              >
                <Flex gap={2} align='center'>
                  Category {renderSortIcon('category')}
                </Flex>
              </Th>
              <Th>
                <Flex gap={2} align='center'>
                  <span>Geographies</span>
                  <Popover>
                    <PopoverTrigger>
                      <IconButton
                        aria-label='Filter geographies'
                        icon={<FiFilter />}
                        size='xs'
                        variant='ghost'
                        colorScheme={
                          selectedGeographies.length > 0 ? 'blue' : 'gray'
                        }
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverBody>
                        {configLoading ? (
                          <Spinner size='sm' />
                        ) : (
                          <Select
                            isMulti
                            isClearable
                            options={geographyOptions}
                            value={selectedGeographies}
                            onChange={(newValue) => {
                              setSelectedGeographies(
                                newValue as Array<{
                                  value: string
                                  label: string
                                }>,
                              )
                            }}
                            placeholder='Select geographies...'
                            closeMenuOnSelect={false}
                            size='sm'
                          />
                        )}
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Flex>
              </Th>
              <Th
                onClick={() => handleHeaderClick('published_date')}
                cursor='pointer'
              >
                <Tooltip
                  placement='top'
                  label='The earliest published date recorded for this family'
                >
                  <Flex gap={2} align='center'>
                    Published {renderSortIcon('published_date')}
                  </Flex>
                </Tooltip>
              </Th>
              <Th
                onClick={() => handleHeaderClick('last_updated_date')}
                cursor='pointer'
              >
                <Tooltip
                  placement='top'
                  label='The latest event recorded for this family'
                >
                  <Flex gap={2} align='center'>
                    Changed {renderSortIcon('last_updated_date')}
                  </Flex>
                </Tooltip>
              </Th>
              <Th
                onClick={() => handleHeaderClick('last_modified')}
                cursor='pointer'
              >
                <Tooltip placement='top' label='Edited within the system'>
                  <Flex gap={2} align='center'>
                    Edited {renderSortIcon('last_modified')}
                  </Flex>
                </Tooltip>
              </Th>
              <Th onClick={() => handleHeaderClick('created')} cursor='pointer'>
                <Tooltip placement='top' label='Date added to system'>
                  <Flex gap={2} align='center'>
                    Created {renderSortIcon('created')}
                  </Flex>
                </Tooltip>
              </Th>
              <Th onClick={() => handleHeaderClick('status')} cursor='pointer'>
                <Flex gap={2} align='center'>
                  Status {renderSortIcon('status')}
                </Flex>
              </Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredItems?.length === 0 && (
              <Tr>
                <Td colSpan={8}>No results found, please amend your search</Td>
              </Tr>
            )}
            {filteredItems?.map((family) => (
              <Tr
                key={family.import_id}
                data-testid={`family-row-${family.import_id}`}
                borderLeft={
                  family.import_id === familyError ? '2px' : 'inherit'
                }
                borderColor={
                  family.import_id === familyError ? 'red.500' : 'inherit'
                }
              >
                <Td>
                  <Flex gap='2' alignItems='center'>
                    {(!family.documents?.length || !family.events?.length) && (
                      <WarningIcon color='red.500' data-testid='warning-icon' />
                    )}
                    {family.title}
                  </Flex>
                </Td>
                <Td>{family.category}</Td>
                <Td>
                  <Flex gap={1} wrap='wrap'>
                    {family.geography && (
                      <Badge colorScheme='gray' variant='subtle'>
                        {family.geography}
                      </Badge>
                    )}
                  </Flex>
                </Td>
                <Td>{formatDate(family.published_date)}</Td>
                <Td>{formatDate(family.last_updated_date)}</Td>
                <Td>
                  <Tooltip
                    placement='top'
                    label={formatDateTime(family.last_modified)}
                  >
                    <Flex gap={2} align='center'>
                      {formatDate(family.last_modified)}
                    </Flex>
                  </Tooltip>
                </Td>
                <Td>
                  <Tooltip
                    placement='top'
                    label={formatDateTime(family.created)}
                  >
                    <Flex gap={2} align='center'>
                      {formatDate(family.created)}
                    </Flex>
                  </Tooltip>
                </Td>

                <Td>
                  <Badge colorScheme={getStatusColour(family.status)} size='sm'>
                    {getStatusAlias(family.status)}
                  </Badge>
                </Td>
                <Td>
                  <HStack gap={2}>
                    <Tooltip label='Edit'>
                      <Link to={`/family/${family.import_id}/edit`}>
                        <IconButton
                          aria-label='Edit document'
                          icon={<GoPencil />}
                          variant='outline'
                          size='sm'
                          colorScheme='blue'
                        />
                      </Link>
                    </Tooltip>
                    <DeleteButton
                      isDisabled={
                        !canModify(family.organisation, isSuperuser, userAccess)
                      }
                      entityName='family'
                      entityTitle={family.title}
                      callback={() => handleDeleteClick(family.import_id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}
