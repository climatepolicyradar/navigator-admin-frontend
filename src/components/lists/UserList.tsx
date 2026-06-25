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
import { IUser } from '@/interfaces/User'
import useUsers from '@/hooks/useUsers'

export default function UserList() {
  const [sortControls, setSortControls] = useState<{
    key: keyof IUser
    reverse: boolean
  }>({ key: 'email', reverse: false })
  const [filteredItems, setFilteredItems] = useState<IUser[]>()
  const { users, loading, error } = useUsers()
  const [formError] = useState<IError | null | undefined>()

  const renderSortIcon = (key: keyof IUser) => {
    if (sortControls.key !== key) {
      return <ArrowUpDownIcon />
    }
    if (sortControls.reverse) {
      return <ArrowDownIcon />
    } else {
      return <ArrowUpIcon />
    }
  }

  const handleHeaderClick = (key: keyof IUser) => {
    if (sortControls.key === key) {
      setSortControls({ key, reverse: !sortControls.reverse })
    } else {
      setSortControls({ key, reverse: false })
    }
  }

  useEffect(() => {
    if (users) {
      const sortedItems = users
        .slice()
        .sort(sortBy(sortControls.key, sortControls.reverse))
      setFilteredItems(sortedItems)
    } else {
      setFilteredItems([])
    }
  }, [sortControls, users])

  useEffect(() => {
    setFilteredItems(users)
  }, [users])

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
                    onClick={() => handleHeaderClick('email')}
                    cursor='pointer'
                  >
                    Email {renderSortIcon('email')}
                  </Th>
                  <Th
                    onClick={() => handleHeaderClick('name')}
                    cursor='pointer'
                  >
                    Name {renderSortIcon('name')}
                  </Th>
                  <Th>Superuser</Th>
                  <Th>Organisations</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredItems?.length === 0 && (
                  <Tr>
                    <Td colSpan={5}>
                      No results found, please amend your search
                    </Td>
                  </Tr>
                )}
                {filteredItems?.map((user) => (
                  <Tr key={user.email}>
                    <Td>{user.email}</Td>
                    <Td>{user.name}</Td>
                    <Td>{user.is_superuser ? 'Yes' : 'No'}</Td>
                    <Td>{user.organisations.length} orgs</Td>
                    <Td>
                      <HStack gap={2}>
                        <Tooltip label='View'>
                          <Link to={`/user/${encodeURIComponent(user.email)}`}>
                            <IconButton
                              aria-label='View user'
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
