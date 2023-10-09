import { useParams } from 'react-router-dom'
import { Box, Heading, Text } from '@chakra-ui/react'
import { FamilyForm } from '@/components/forms/FamilyForm'

export default function Family() {
  const { importId } = useParams()
  console.log(importId)

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
