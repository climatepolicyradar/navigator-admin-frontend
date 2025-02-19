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
  Spacer,
} from '@chakra-ui/react'
import { Link, Form, Outlet, useSearchParams } from 'react-router-dom'

export default function Corpora() {
  const [searchParams] = useSearchParams()

  return (
    <Flex gap={4} height={'100%'} flexDirection={'column'}>
      <Flex alignItems='center' gap='4'>
        <Box>
          <Heading as={'h1'}>Corpora</Heading>
        </Box>
        <Box flex='1'>
          <Form id='search-form' role='search'>
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
                aria-label='Search corpora'
                icon={<SearchIcon />}
                roundedLeft={0}
              />
            </HStack>
          </Form>
        </Box>
        <Spacer />
        <ButtonGroup>
          <Button as={Link} colorScheme='blue' to='/corpus/new'>
            Add new Corpus
          </Button>
        </ButtonGroup>
      </Flex>
      <Outlet />
    </Flex>
  )
}
