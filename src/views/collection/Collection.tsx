import { useParams, Link as RouterLink } from 'react-router-dom'
import {
  Link,
  Box,
  Heading,
  Text,
  Button,
  SkeletonText,
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { CollectionForm } from '@/components/forms/CollectionForm'
import useCollection from '@/hooks/useCollection'
import { Loader } from '@/components/Loader'
import { ApiError } from '@/components/feedback/ApiError'

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
      <Box display='flex'>
        <Link
          as={RouterLink}
          to='/collections'
          display='flex'
          alignItems='center'
        >
          <ArrowBackIcon mr='2' /> Back to collections
        </Link>
      </Box>
      <Heading as={'h1'}>{pageTitle}</Heading>
      <Text>
        <Text as='span' color={'red.500'}>
          *
        </Text>{' '}
        indicates required fields
      </Text>
      <Box my={4} p={4} bg={'gray.50'} boxShadow='base'>
        {error && (
          <>
            <ApiError error={error} />
            <Button
              as={RouterLink}
              to={'/collections'}
              colorScheme='blue'
              mt={4}
            >
              Back to collections
            </Button>
          </>
        )}
        {loading && (
          <>
            <Box padding='4' bg='white'>
              <Loader />
              <SkeletonText
                mt='4'
                noOfLines={12}
                spacing='4'
                skeletonHeight='2'
              />
            </Box>
          </>
        )}
        {canLoadForm && <CollectionForm collection={collection ?? undefined} />}
      </Box>
    </>
  )
}
