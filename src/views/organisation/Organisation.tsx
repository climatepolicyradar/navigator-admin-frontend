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
import useOrganisation from '@/hooks/useOrganisation'
import { OrganisationForm } from '@/components/forms/OrganisationForm'

export default function Organisation() {
  const { id } = useParams()
  const { organisation, loading, error } = useOrganisation(id)

  const canLoadForm = !loading && !error
  const pageTitle = loading
    ? 'Loading...'
    : organisation
      ? `Editing: ${organisation.display_name}`
      : 'Create new organisation'

  return (
    <>
      <Box display='flex'>
        <Link
          as={RouterLink}
          to='/organisations'
          display='flex'
          alignItems='center'
        >
          <ArrowBackIcon mr='2' /> Back to organisations
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
              to={'/organisations'}
              colorScheme='blue'
              mt={4}
            >
              Back to organisations
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
          <OrganisationForm organisation={organisation ?? undefined} />
        )}
      </Box>
    </>
  )
}
