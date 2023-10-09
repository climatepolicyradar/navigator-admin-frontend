import { useParams, Link } from 'react-router-dom'
import { Box, Heading, Text, Button, SkeletonText } from '@chakra-ui/react'
import { FamilyForm } from '@/components/forms/FamilyForm'
import useFamily from '@/hooks/useFamily'
import { Loader } from '@/components/Loader'

export default function Family() {
  const { importId } = useParams()
  const { family, loading, error } = useFamily(importId)

  const canLoadForm = !loading && !error
  // const canLoadForm = false

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
        {error && (
          <>
            <Text color={'red.500'}>{error.message}</Text>
            <Text fontSize="xs" color={'gray.500'}>
              {error.detail}
            </Text>
            <Button as={Link} to={'/families'} colorScheme="blue" mt={4}>
              Back to families
            </Button>
          </>
        )}
        {loading && (
          <>
            <Box padding="4" bg="white">
              <Loader />
              <SkeletonText
                mt="4"
                noOfLines={12}
                spacing="4"
                skeletonHeight="2"
              />
            </Box>
          </>
        )}
        {canLoadForm && <FamilyForm family={family ?? undefined} />}
      </Box>
    </>
  )
}
