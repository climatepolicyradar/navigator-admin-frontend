import { Box, Flex, Heading } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'

export default function Users() {
  return (
    <Flex gap={4} height={'100%'} flexDirection={'column'}>
      <Flex alignItems='center' gap='4'>
        <Box>
          <Heading as={'h1'}>Users</Heading>
        </Box>
      </Flex>
      <Outlet />
    </Flex>
  )
}
