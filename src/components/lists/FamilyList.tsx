import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  WarningIcon,
} from '@chakra-ui/icons'
import {
  Badge,
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { useEffect, useMemo, useState } from 'react'
import { FiFilter } from 'react-icons/fi'
import { GoPencil } from 'react-icons/go'
import { Link, useLoaderData, useSearchParams } from 'react-router-dom'

import { deleteFamily, getFamilies, TFamilySearchQuery } from '@/api/Families'
import useConfig from '@/hooks/useConfig'
import { IChakraSelect, IError, TFamily } from '@/interfaces'
import { canModify } from '@/utils/canModify'
import { decodeToken } from '@/utils/decodeToken'
import { getCountries } from '@/utils/extractNestedGeographyData'
import { formatDate, formatDateTime } from '@/utils/formatDate'
import { getStatusAlias } from '@/utils/getStatusAlias'
import { getStatusColour } from '@/utils/getStatusColour'
import { sortBy } from '@/utils/sortBy'

import { DeleteButton } from '../buttons/Delete'
import { ApiError } from '../feedback/ApiError'

interface ILoaderProps {
  request: {
    url: string
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ request }: ILoaderProps) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const geographies = url.searchParams.getAll('geography')
  const status = url.searchParams.get('status')
  const searchQuery: TFamilySearchQuery = {
    query: q,
  }
  if (geographies.length) {
    searchQuery['geographies'] = geographies
  }
  if (status) {
    searchQuery['status'] = status
  }
  const response = await getFamilies(searchQuery)
  return response
}

const STATUSES = [
  { value: 'Created', label: 'Created' },
  { value: 'Published', label: 'Published' },
  { value: 'Deleted', label: 'Deleted' },
]

export default function FamilyList() {
  const [selectedGeographies, setSelectedGeographies] = useState<
    IChakraSelect[]
  >([])
  const [sortControls, setSortControls] = useState<{
    key: keyof TFamily
    reverse: boolean
  }>({ key: 'last_modified', reverse: true })
  const [filteredItems, setFilteredItems] = useState<TFamily[]>()
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    response: { data: families },
  } = useLoaderData() as { response: { data: TFamily[] } }
  const { config, loading: configLoading, error: configError } = useConfig()
  const toast = useToast()
  const [familyError, setFamilyError] = useState<string | null | undefined>()
  const [formError, setFormError] = useState<IError | null | undefined>()
  // String so useEffect doesn't keep re-rendering (referential comparison)
  const qGeographies = searchParams.getAll('geography').join(';')

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
    const geographyFiltered = families.filter((family) =>
      selectedGeographies.length
        ? selectedGeographies.some((geography) =>
            family.geographies.includes(geography.value),
          )
        : true,
    )

    // Then filter by status from URL
    const statusParam = searchParams.get('status')
    const statusFiltered = statusParam
      ? geographyFiltered.filter((family) => family.status === statusParam)
      : geographyFiltered

    // Finally, sort the filtered results
    const sortedItems = statusFiltered
      .slice()
      .sort(sortBy(sortControls.key, sortControls.reverse))

    setFilteredItems(sortedItems)
  }, [families, selectedGeographies, sortControls, searchParams])

  const handleGeographyChange = (newValue: unknown) => {
    const selectedItems = newValue as IChakraSelect[]
    setSearchParams({
      q: searchParams.get('q') ?? '',
      status: searchParams.get('status') ?? '',
      geography: selectedItems.map((item) => item.label),
    })
  }

  // Get all available geographies from config
  const geographyOptions = useMemo(() => {
    if (!config) return []

    const countries = getCountries(config.geographies)
    return countries
      .map((country) => ({
        value: country.value, // ISO code
        label: country.display_value, // Long geography name
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [config])

  useEffect(() => {
    const geographiesArray = qGeographies ? qGeographies.split(';') : []
    const convertedGeographies: IChakraSelect[] = geographiesArray.map(
      (geography) =>
        geographyOptions.find(
          (option) => option.value === geography || option.label === geography,
        ) || { value: geography, label: geography },
    )

    setSelectedGeographies(convertedGeographies)
  }, [qGeographies, geographyOptions])

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
                  {!configError && (
                    <Popover>
                      <PopoverTrigger>
                        <IconButton
                          aria-label='Filter by geographies'
                          icon={<FiFilter />}
                          size='xs'
                          variant='ghost'
                          colorScheme={
                            selectedGeographies.length ? 'blue' : 'gray'
                          }
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverBody>
                          {configLoading ? (
                            <Spinner size='sm' />
                          ) : (
                            <Select
                              isMulti={true}
                              isClearable={true}
                              options={geographyOptions}
                              value={selectedGeographies}
                              onChange={handleGeographyChange}
                              placeholder='Select geographies...'
                              closeMenuOnSelect={false}
                              size='sm'
                            />
                          )}
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  )}
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
              <Th>
                <Flex gap={2} align='center'>
                  <span>Status</span>
                  {!configError && (
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label='Filter status'
                        icon={<FiFilter />}
                        size='xs'
                        variant='ghost'
                        colorScheme={
                          searchParams.get('status') ? 'blue' : 'gray'
                        }
                      />
                      {!configLoading && (
                        <MenuList>
                          <MenuItem
                            onClick={() => {
                              const newParams = new URLSearchParams(
                                searchParams,
                              )
                              newParams.delete('status')
                              setSearchParams(newParams)
                            }}
                            fontWeight={
                              !searchParams.get('status') ? 'bold' : 'normal'
                            }
                          >
                            All
                          </MenuItem>
                          {STATUSES.map((status) => (
                            <MenuItem
                              key={status.value}
                              onClick={() => {
                                const newParams = new URLSearchParams(
                                  searchParams,
                                )
                                newParams.set('status', status.value)
                                setSearchParams(newParams)
                              }}
                              fontWeight={
                                searchParams.get('status') === status.value
                                  ? 'bold'
                                  : 'normal'
                              }
                            >
                              {status.label}
                            </MenuItem>
                          ))}
                        </MenuList>
                      )}
                    </Menu>
                  )}
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
                    {family.geographies.sort().map((geography) => (
                      <Badge
                        key={geography}
                        colorScheme='gray'
                        variant='subtle'
                      >
                        {geography}
                      </Badge>
                    ))}
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
