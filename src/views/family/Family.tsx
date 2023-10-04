import { FamilyForm } from '@/components/forms/FamilyForm'
import { Box, Heading, Text } from '@chakra-ui/react'

export default function Family() {
  return (
    <>
      <Heading as={'h1'}>Create new family</Heading>
      <Text>
        <Text as="span" color={'red.500'}>
          *
        </Text>{' '}
        indicates required fields
      </Text>
      <Box my={4} p={4} bg={'gray.50'} boxShadow="base">
        <FamilyForm />
      </Box>
    </>
  )
}
