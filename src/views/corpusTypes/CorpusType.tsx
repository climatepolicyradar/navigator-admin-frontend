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
import { Loader } from '@/components/Loader'
import { ApiError } from '@/components/feedback/ApiError'
import useCorpusType from '@/hooks/useCorpusType'
import { CorpusTypeForm } from '@/components/forms/CorpusTypeForm'

export default function CorpusType() {
  const { name } = useParams()
  const { corpusType, loading, error } = useCorpusType(name)

  const canLoadForm = !loading && !error
  const pageTitle = loading
    ? 'Loading...'
    : corpusType
      ? `Editing: ${corpusType.name}`
      : 'Create new corpus type'

  return (
    <>
      <Box display='flex'>
        <Link
          as={RouterLink}
          to='/corpus-types'
          display='flex'
          alignItems='center'
        >
          <ArrowBackIcon mr='2' /> Back to corpus types
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
              to={'/corpus-types'}
              colorScheme='blue'
              mt={4}
            >
              Back to corpus types
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
        {canLoadForm && <CorpusTypeForm corpusType={corpusType ?? undefined} />}
      </Box>
    </>
  )
}
