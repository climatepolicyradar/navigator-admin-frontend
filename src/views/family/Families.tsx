import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  SkeletonText,
  Spacer,
} from '@chakra-ui/react'
import {
  Link,
  Form,
  Outlet,
  useNavigation,
  useSearchParams,
} from 'react-router-dom'

import { Loader } from '@/components/Loader'
import { SearchIcon } from '@chakra-ui/icons'

export default function Families() {
  const navigation = useNavigation()
  const [searchParams] = useSearchParams()

  return (
    <Flex gap={4} height={'100%'} flexDirection={'column'}>
      <Flex alignItems="center" gap="4">
        <Box>
          <Heading as={'h1'}>Families</Heading>
        </Box>
        <Box flex="1">
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
                maxW="600px"
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
    </Flex>
  )
}
