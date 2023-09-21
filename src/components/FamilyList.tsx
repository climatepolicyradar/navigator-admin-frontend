import { Link, useLoaderData } from 'react-router-dom'
import { deleteFamily, getFamilies } from '@/api/Families'
import { IError, IFamily } from '@/interfaces'
import { formatDate } from '@/utils/Date'
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
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react'
import { GoPencil } from 'react-icons/go'

import { DeleteFamily } from './buttons/DeleteFamily'
import { useState } from 'react'

interface ILoaderProps {
  request: {
    url: string
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ request }: ILoaderProps) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const response = await getFamilies(q)
  return response
}

export default function FamilyList() {
  const {
    response: { data: families },
  } = useLoaderData() as { response: { data: IFamily[] } }
  const toast = useToast()
  const [familyError, setFamilyError] = useState<string | null | undefined>()
  const [formError, setFormError] = useState<IError | null | undefined>()

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

  return (
    <Box flex={1}>
      <Box>
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
              <Th>ID</Th>
              <Th>Title</Th>
              <Th>Category</Th>
              <Th>Geography</Th>
              <Th>Collection IDs</Th>
              <Th>Published date</Th>
              <Th>Updated date</Th>
              <Th>Status</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {families.map((family) => (
              <Tr
                key={family.import_id}
                borderLeft={family.import_id === familyError ? '2px' : 'inherit'}
                borderColor={family.import_id === familyError ? 'red.500' : 'inherit'}
              >
                <Td>{family.import_id}</Td>
                <Td>{family.title}</Td>
                <Td>{family.category}</Td>
                <Td>{family.geography}</Td>
                <Td>{family.collections}</Td>
                <Td>{formatDate(family.published_date)}</Td>
                <Td>{formatDate(family.last_updated_date)}</Td>
                <Td>
                  <Badge colorScheme="green" size="sm">
                    {family.status}
                  </Badge>
                </Td>
                <Td>
                  <HStack gap={2}>
                    <Tooltip label="Edit">
                      <Link to={`/family/${family.import_id}/edit`}>
                        <IconButton
                          aria-label="Edit document"
                          icon={<GoPencil />}
                          variant="outline"
                          size="sm"
                          colorScheme="blue"
                        />
                      </Link>
                    </Tooltip>
                    <DeleteFamily
                      family={family}
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
