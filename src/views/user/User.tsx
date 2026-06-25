import { useParams, Link as RouterLink } from 'react-router-dom'
import {
  Link,
  Box,
  Heading,
  Text,
  Button,
  SkeletonText,
  Badge,
  VStack,
  HStack,
  Divider,
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { Loader } from '@/components/Loader'
import { ApiError } from '@/components/feedback/ApiError'
import useUser from '@/hooks/useUser'
import useOrganisations from '@/hooks/useOrganisations'

export default function User() {
  const { email } = useParams()
  const { user, loading, error } = useUser(email)
  const { organisations } = useOrganisations()

  const canLoadDetail = !loading && !error
  const pageTitle = loading
    ? 'Loading...'
    : user
      ? user.email
      : 'User not found'

  const getOrgName = (orgId: number) => {
    const org = organisations.find((o) => o.id === orgId)
    return org?.display_name ?? String(orgId)
  }

  return (
    <>
      <Box display='flex'>
        <Link as={RouterLink} to='/users' display='flex' alignItems='center'>
          <ArrowBackIcon mr='2' /> Back to users
        </Link>
      </Box>
      <Heading as={'h1'} mt={2}>
        {pageTitle}
      </Heading>
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
        {canLoadDetail && user && (
          <VStack align='stretch' gap={4}>
            <Box>
              <Text fontWeight='semibold' fontSize='sm' color='gray.500'>
                Email
              </Text>
              <Text>{user.email}</Text>
            </Box>
            <Box>
              <Text fontWeight='semibold' fontSize='sm' color='gray.500'>
                Name
              </Text>
              <Text>{user.name ?? '—'}</Text>
            </Box>
            <Box>
              <Text fontWeight='semibold' fontSize='sm' color='gray.500'>
                Superuser
              </Text>
              <Badge colorScheme={user.is_superuser ? 'purple' : 'gray'}>
                {user.is_superuser ? 'Yes' : 'No'}
              </Badge>
            </Box>
            <Box>
              <Text fontWeight='semibold' fontSize='sm' color='gray.500'>
                Organisations
              </Text>
              {user.organisations.length === 0 ? (
                <Text color='gray.400'>None</Text>
              ) : (
                <VStack align='stretch' mt={1} gap={1}>
                  {user.organisations.map((membership) => (
                    <HStack key={membership.id}>
                      <Text>{getOrgName(membership.id)}</Text>
                      {membership.is_admin && (
                        <Badge colorScheme='blue' size='sm'>
                          Admin
                        </Badge>
                      )}
                    </HStack>
                  ))}
                </VStack>
              )}
            </Box>

            <Divider />

            <Box
              p={4}
              bg='blue.50'
              borderRadius='md'
              borderLeft='4px solid'
              borderColor='blue.300'
            >
              <Text fontWeight='semibold' color='blue.700'>
                Editing coming soon
              </Text>
              <Text fontSize='sm' color='blue.600' mt={1}>
                The ability to update user details and manage organisation
                memberships will be available in a future release.
              </Text>
            </Box>
          </VStack>
        )}
      </Box>
    </>
  )
}
