import { Outlet, useNavigation } from 'react-router-dom'

import { ContentWrapper } from '@components/ContentWrapper'
import { Header } from '@components/Header'
import { Loader } from '@components/Loader'

function Root() {
  const navigation = useNavigation()

  return (
    <>
      <Header />
      <ContentWrapper>
        {navigation.state === 'loading' ? <Loader /> : <Outlet />}
      </ContentWrapper>
    </>
  )
}

export default Root
