import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Input,
  SkeletonText,
  Spacer,
  Stack,
} from '@chakra-ui/react'
import {
  Link,
  Form,
  Outlet,
  useNavigation,
  useSearchParams,
} from 'react-router-dom'

import { Loader } from '@/components/Loader'

export default function Families() {
  const navigation = useNavigation()
  const [searchParams] = useSearchParams()

  return (
    <Stack spacing={4}>
      <Flex alignItems="center" gap="4">
        <Box>
          <Heading as={'h1'}>Families</Heading>
        </Box>
        <Box>
          <Form id="search-form" role="search">
            <Input
              bg="white"
              id="q"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={searchParams.get('q') ?? ''}
            />
          </Form>
        </Box>
        <Spacer />
        <ButtonGroup>
          <Button as={Link} colorScheme="blue" to="/family/new">
            Add new Family
          </Button>
        </ButtonGroup>
      </Flex>
      {navigation.state === 'loading' ? (
        <Box padding="4" bg="white">
          <Loader />
          <SkeletonText mt="4" noOfLines={3} spacing="4" skeletonHeight="2" />
        </Box>
      ) : (
        <Outlet />
      )}
    </Stack>
  )
}
