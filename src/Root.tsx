import { Outlet, useNavigation } from 'react-router-dom'

import { ContentWrapper } from '@components/ContentWrapper'
import { Header } from '@components/Header'
import { Loader } from '@components/Loader'
import { Box, SkeletonText } from '@chakra-ui/react'

function Root() {
  const navigation = useNavigation()

  return (
    <>
      <Header />
      <ContentWrapper>
        {navigation.state === 'loading' ? (
          <Box padding="4" bg="white">
            <Loader />
            <SkeletonText mt="4" noOfLines={3} spacing="4" skeletonHeight="2" />
          </Box>
        ) : (
          <Outlet />
        )}
      </ContentWrapper>
    </>
  )
}

export default Root
