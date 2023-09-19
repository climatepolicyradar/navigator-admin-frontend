import { Link as ReactRouterLink } from 'react-router-dom'
import { Heading, Link, Stack, Text } from '@chakra-ui/react'

const Dashboard = () => {
  return (
    <Stack spacing={4}>
      <Heading as={'h1'}>Dashboard</Heading>
      <Text>
        Content for the dashboard TBC, but for now{' '}
        <Link as={ReactRouterLink} color="teal.500" to="/families">
          click here to view families
        </Link>
      </Text>
    </Stack>
  )
}

export default Dashboard
