import { Outlet } from 'react-router-dom'

import { useAuth } from './hooks/useAuth'

import { ContentWrapper } from '@components/ContentWrapper'
import { Header } from '@components/Header'

function Root() {
  const { token } = useAuth()

  return (
    <>
      <Header />
      <ContentWrapper>
        <div>Authenticated as {token}</div>
        {token && (
          <button type="button" onClick={() => null}>
            Sign Out
          </button>
        )}
        <Outlet />
      </ContentWrapper>
    </>
  )
}

export default Root
