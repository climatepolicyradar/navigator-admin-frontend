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
import useUser from '@/hooks/useUser'
import { UserForm } from '@/components/forms/UserForm'

export default function User() {
  const { email } = useParams()
  const { user, loading, error } = useUser(email)

  const canLoadForm = !loading && !error
  const pageTitle = loading
    ? 'Loading...'
    : user
      ? `Editing: ${user.email}`
      : 'User not found'

  return (
    <>
      <Box display='flex'>
        <Link as={RouterLink} to='/users' display='flex' alignItems='center'>
          <ArrowBackIcon mr='2' /> Back to users
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
            <Button as={RouterLink} to={'/users'} colorScheme='blue' mt={4}>
              Back to users
            </Button>
          </>
        )}
        {loading && (
          <Box padding='4' bg='white'>
            <Loader />
            <SkeletonText mt='4' noOfLines={6} spacing='4' skeletonHeight='2' />
          </Box>
        )}
        {canLoadForm && user && <UserForm user={user} />}
      </Box>
    </>
  )
}
