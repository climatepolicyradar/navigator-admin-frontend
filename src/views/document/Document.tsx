import { useParams, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Heading,
  Text,
  Button,
  SkeletonText,
  Link,
} from '@chakra-ui/react'
import useDocument from '@/hooks/useDocument'
import { Loader } from '@/components/Loader'
import { DocumentForm } from '@/components/forms/DocumentForm'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { ApiError } from '@/components/feedback/ApiError'
import useFamily from '@/hooks/useFamily'
import useCorpus from '@/hooks/useCorpus'
import useConfig from '@/hooks/useConfig'
import useTaxonomy from '@/hooks/useTaxonomy'

export default function Document() {
  const { importId } = useParams()
  const { document, loading, error } = useDocument(importId)
  const { config } = useConfig()
  const { family } = useFamily(document?.family_import_id)
  const corpusInfo = useCorpus(config?.corpora, family?.corpus_import_id)
  const taxonomy = useTaxonomy(corpusInfo?.corpus_type, corpusInfo?.taxonomy)
  console.log('family: ', family)
  console.log('corpusInfo: ', corpusInfo)
  console.log('taxonomy: ', taxonomy)

  const canLoadForm = !loading && !error
  const pageTitle = loading
    ? 'Loading...'
    : document
      ? `Editing: ${document.title}`
      : 'Create new document'

  return (
    <>
      <Box display='flex'>
        <Link
          as={RouterLink}
          to='/documents'
          display='flex'
          alignItems='center'
        >
          <ArrowBackIcon mr='2' /> Back to documents
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
            <Button as={RouterLink} to={'/documents'} colorScheme='blue' mt={4}>
              Back to Documents
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
        {canLoadForm && (
          <DocumentForm document={document ?? undefined} taxonomy={taxonomy} />
        )}
      </Box>
    </>
  )
}
