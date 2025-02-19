import { Flex } from '@chakra-ui/react'
import { ContentWrapper } from '@components/ContentWrapper'
import { Header } from '@components/Header'
import { Outlet } from 'react-router-dom'

function Root() {
  return (
    <Flex flexDirection={'column'} gap={0} height={'100%'}>
      <Header />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </Flex>
  )
}

export default Root
