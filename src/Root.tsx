import { Outlet } from 'react-router-dom'

import { ContentWrapper } from '@components/ContentWrapper'
import { Header } from '@components/Header'

function Root() {
  return (
    <>
      <Header />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </>
  )
}

export default Root
