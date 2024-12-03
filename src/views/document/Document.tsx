import { useMemo } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Heading,
  Text,
  Button,
  SkeletonText,
  Link,
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { Loader } from '@/components/Loader'
import { DocumentForm } from '@/components/forms/DocumentForm'
import { ApiError } from '@/components/feedback/ApiError'
import useDocument from '@/hooks/useDocument'
import useFamily from '@/hooks/useFamily'
import useConfig from '@/hooks/useConfig'
import useTaxonomy from '@/hooks/useTaxonomy'
import { decodeToken } from '@/utils/decodeToken'
import { IDecodedToken } from '@/interfaces'
import { canModify } from '@/utils/canModify'
import useCorpusFromConfig from '@/hooks/useCorpusFromConfig'

export default function Document() {
  const { importId } = useParams()
  const { document, loading, error } = useDocument(importId)
  const { config, loading: configLoading, error: configError } = useConfig()
  const {
    family,
    loading: familyLoading,
    error: familyError,
  } = useFamily(document?.family_import_id)
  const corpusInfo = useCorpusFromConfig(
    config?.corpora,
    family?.corpus_import_id,
  )
  const taxonomy = useTaxonomy(corpusInfo?.corpus_type, corpusInfo?.taxonomy)
  const userToken = useMemo(() => {
    const token = localStorage.getItem('token')
    if (!token) return null
    const decodedToken: IDecodedToken | null = decodeToken(token)
    return decodedToken
  }, [])

  const userAccess = !userToken ? null : userToken.authorisation
  const isSuperUser = !userToken ? false : userToken.is_superuser
  // TODO: Get org_id from corpus PDCT-1171.
  const orgName = family ? String(family?.organisation) : null

  const canLoadForm =
    !loading &&
    !configLoading &&
    !familyLoading &&
    !error &&
    !configError &&
    !familyError
  const pageTitle =
    loading || familyLoading || configLoading
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
          <DocumentForm
            document={document ?? undefined}
            taxonomy={taxonomy}
            canModify={canModify(orgName, isSuperUser, userAccess)}
          />
        )}
      </Box>
    </>
  )
}
