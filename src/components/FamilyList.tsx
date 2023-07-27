import { TFamily } from '@/interfaces'
import { formatDate } from '@/utlities/FormatDate'
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
import { Link } from 'react-router-dom'

type TProps = {
  families: TFamily[]
}

export default function FamilyList({ families }: TProps) {
  return (
    <>
      <TableContainer>
        <Table size="sm">
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
                  <HStack spacing="2">
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
                  <Link to={`${family.import_id}`}>
                    <IconButton
                      aria-label="Edit document"
                      icon={<GoPencil />}
                      variant="solid"
                      size="sm"
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
