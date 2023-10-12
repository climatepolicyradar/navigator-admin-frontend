import { useParams, Link } from 'react-router-dom'
import { Box, Heading, Text, Button, SkeletonText } from '@chakra-ui/react'
import { CollectionForm } from '@/components/forms/CollectionForm'
import useCollection from '@/hooks/useCollection'
import { Loader } from '@/components/Loader'

export default function Collection() {
  const { importId } = useParams()
  const { collection, loading, error } = useCollection(importId)

  const canLoadForm = !loading && !error
  const pageTitle = loading
    ? 'Loading...'
    : collection
    ? `Editing: ${collection.title}`
    : 'Create new collection'

  return (
    <>
      <Heading as={'h1'}>{pageTitle}</Heading>
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
            <Button as={Link} to={'/collections'} colorScheme="blue" mt={4}>
              Back to collections
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
        {canLoadForm && <CollectionForm collection={collection ?? undefined} />}
      </Box>
    </>
  )
}
