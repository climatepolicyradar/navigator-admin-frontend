import { ArrowBackIcon } from '@chakra-ui/icons'
import {
  Box,
  Heading,
  Text,
  Button,
  SkeletonText,
  Link,
} from '@chakra-ui/react'
import { useParams, Link as RouterLink } from 'react-router-dom'

import { Loader } from '@/components/Loader'
import { ApiError } from '@/components/feedback/ApiError'
import { FamilyForm } from '@/components/forms/FamilyForm'
import useFamily from '@/hooks/useFamily'

export default function Family() {
  const { importId } = useParams()
  const { family, loading, error } = useFamily(importId)

  const canLoadForm = !loading && !error
  const pageTitle = loading
    ? 'Loading...'
    : family
      ? `Editing: ${family.title}`
      : 'Create new family'

  return (
    <>
      <Box display='flex'>
        <Link as={RouterLink} to='/families' display='flex' alignItems='center'>
          <ArrowBackIcon mr='2' /> Back to families
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
            <Button as={RouterLink} to={'/families'} colorScheme='blue' mt={4}>
              Back to families
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
        {canLoadForm && <FamilyForm family={family ?? undefined} />}
      </Box>
    </>
  )
}
