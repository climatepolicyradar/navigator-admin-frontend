import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  Spacer,
} from '@chakra-ui/react'
import { Link, Form, Outlet, useSearchParams } from 'react-router-dom'

import { SearchIcon } from '@chakra-ui/icons'

export default function Documents() {
  const [searchParams] = useSearchParams()

  return (
    <Flex gap={4} height={'100%'} flexDirection={'column'}>
      <Flex alignItems="center" gap="4">
        <Box>
          <Heading as={'h1'}>Documents</Heading>
        </Box>
        <Box>
          <Form id="search-form" role="search">
            <HStack spacing="0">
              <Input
                bg="white"
                id="q"
                placeholder="Search"
                type="search"
                name="q"
                defaultValue={searchParams.get('q') ?? ''}
                roundedRight={0}
              />
              <IconButton
                type="submit"
                aria-label="Search database"
                icon={<SearchIcon />}
                roundedLeft={0}
              />
            </HStack>
          </Form>
        </Box>
        <Spacer />
        <ButtonGroup>
          <Button as={Link} colorScheme="blue" to="/document/new">
            Add new Document
          </Button>
        </ButtonGroup>
      </Flex>
      <Outlet />
    </Flex>
  )
}
