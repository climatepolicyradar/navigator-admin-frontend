import { useParams, Link } from 'react-router-dom'
import { Box, Heading, Text, Button, SkeletonText } from '@chakra-ui/react'
import useDocument from '@/hooks/useDocument'
import { Loader } from '@/components/Loader'

export default function Collection() {
  const { importId } = useParams()
  const { document, loading, error } = useDocument(importId)

  const canLoadForm = !loading && !error
  const pageTitle = loading
    ? 'Loading...'
    : document
    ? `Editing: ${document.title}`
    : 'Create new document'

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
            <Button as={Link} to={'/documents'} colorScheme="blue" mt={4}>
              Back to Documents
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
        {/* {canLoadForm && <DocumentForm document={document ?? undefined} />} */}
      </Box>
    </>
  )
}