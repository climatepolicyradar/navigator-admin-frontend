import { SearchIcon } from '@chakra-ui/icons'
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
  Text,
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
  const [searchParams, setSearchParams] = useSearchParams()

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const q = formData.get('q') as string
    setSearchParams({
      q,
    })
  }

  return (
    <Flex gap={4} height={'100%'} flexDirection={'column'}>
      <Flex alignItems='center'>
        <Box>
          <Heading as={'h1'}>Families</Heading>
        </Box>
        <Spacer />
        <ButtonGroup>
          <Button as={Link} colorScheme='blue' to='/family/new'>
            Add new Family
          </Button>
        </ButtonGroup>
      </Flex>
      <Box bg={'gray.50'} rounded={'lg'} p={4}>
        <Form id='search-form' role='search' onSubmit={handleSearch}>
          <Flex gap={8}>
            <Box>
              <Text>Search within document titles and summaries</Text>
              <HStack spacing='0'>
                <Input
                  bg='white'
                  id='q'
                  placeholder='Search'
                  type='search'
                  name='q'
                  defaultValue={searchParams.get('q') ?? ''}
                  roundedRight={0}
                  maxW='600px'
                />
                <IconButton
                  type='submit'
                  aria-label='Search database'
                  icon={<SearchIcon />}
                  roundedLeft={0}
                />
              </HStack>
            </Box>
          </Flex>
        </Form>
      </Box>

      {navigation.state === 'loading' ? (
        <Box padding='4' bg='white'>
          <Loader />
          <SkeletonText mt='4' noOfLines={3} spacing='4' skeletonHeight='2' />
        </Box>
      ) : (
        <Outlet />
      )}
    </Flex>
  )
}
