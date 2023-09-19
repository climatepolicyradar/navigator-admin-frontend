import { getFamilies } from '@/api/Families'
import { IFamily } from '@/interfaces'
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
  Tag,
  Flex,
  Button,
  HStack,
} from '@chakra-ui/react'
import {
  GoArrowLeft,
  GoArrowRight,
  GoMoveToEnd,
  GoMoveToStart,
  GoPencil,
} from 'react-icons/go'
import { Link, useLoaderData } from 'react-router-dom'

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

  return (
    <>
      <TableContainer
        height={'80vh'}
        overflowY={'scroll'}
        whiteSpace={'normal'}
      >
        <Table size="sm" variant={'striped'}>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Title</Th>
              <Th>Category</Th>
              <Th>Geography</Th>
              <Th>Collections</Th>
              <Th>Documents</Th>
              <Th>Published date</Th>
              <Th>Updated date</Th>
              <Th>Status</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {families.map((family) => (
              <Tr key={family.import_id}>
                <Td>{family.import_id}</Td>
                <Td>{family.title}</Td>
                <Td>{family.category}</Td>
                <Td>{family.geography}</Td>
                <Td>{family.collections}</Td>
                <Td>
                  <HStack spacing="2" wrap={'wrap'}>
                    {family.documents.map((document) => {
                      return (
                        <Tag key={document} size="sm">
                          {document}
                        </Tag>
                      )
                    })}
                  </HStack>
                </Td>
                <Td>{formatDate(family.published_date)}</Td>
                <Td>{formatDate(family.last_updated_date)}</Td>
                <Td>
                  <Badge colorScheme="green" size="sm">
                    {family.status}
                  </Badge>
                </Td>
                <Td>
                  <Link to={`/family/${family.import_id}/edit`}>
                    <IconButton
                      aria-label="Edit document"
                      icon={<GoPencil />}
                      variant="outline"
                      size="sm"
                      colorScheme="blue"
                    />
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex direction="row" mt="4" justify="center" gap="2">
        <IconButton size="sm" aria-label="first" icon={<GoMoveToStart />} />
        <IconButton size="sm" aria-label="prev" icon={<GoArrowLeft />} />
        <Button size="sm" variant="solid">
          1
        </Button>
        <Button size="sm" variant="solid">
          2
        </Button>
        <Button size="sm" variant="solid">
          3
        </Button>
        <Button size="sm" variant="solid">
          4
        </Button>
        <Button size="sm" variant="solid">
          5
        </Button>
        <IconButton size="sm" aria-label="next" icon={<GoArrowRight />} />
        <IconButton size="sm" aria-label="last" icon={<GoMoveToEnd />} />
      </Flex>
    </>
  )
}
