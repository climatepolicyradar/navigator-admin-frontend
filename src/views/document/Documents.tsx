import { Box, Flex, HStack, Heading, IconButton, Input } from '@chakra-ui/react'
import { Form, Outlet, useSearchParams } from 'react-router-dom'

import { SearchIcon } from '@chakra-ui/icons'

export default function Documents() {
  const [searchParams] = useSearchParams()

  return (
    <Flex gap={4} height={'100%'} flexDirection={'column'}>
      <Flex alignItems='center' gap='4'>
        <Box>
          <Heading as={'h1'}>Documents</Heading>
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
                aria-label='Search database'
                icon={<SearchIcon />}
                roundedLeft={0}
              />
            </HStack>
          </Form>
        </Box>
      </Flex>
      <Outlet />
    </Flex>
  )
}
