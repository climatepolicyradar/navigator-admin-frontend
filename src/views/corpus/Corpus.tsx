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
import { CorpusForm } from '@/components/forms/CorpusForm'
import { Loader } from '@/components/Loader'
import { ApiError } from '@/components/feedback/ApiError'
import useCorpus from '@/hooks/useCorpus'

export default function Corpus() {
  const { importId } = useParams()
  const { corpus, loading, error } = useCorpus(importId)

  const canLoadForm = !loading && !error
  const pageTitle = loading
    ? 'Loading...'
    : corpus
      ? `Editing: ${corpus.title}`
      : 'Create new corpus'

  return (
    <>
      <Box display='flex'>
        <Link as={RouterLink} to='/corpora' display='flex' alignItems='center'>
          <ArrowBackIcon mr='2' /> Back to corpora
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
            <Button as={RouterLink} to={'/corpora'} colorScheme='blue' mt={4}>
              Back to corpora
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
        {canLoadForm && <CorpusForm corpus={corpus ?? undefined} />}
      </Box>
    </>
  )
}
