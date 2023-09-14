import { Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from './hooks/useAuth'

import { ContentWrapper } from '@components/ContentWrapper'
import { Header } from '@components/Header'

function Root() {
  const { token, setToken } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setToken()
    navigate('/', { replace: true })
  }

  return (
    <>
      <Header />
      <ContentWrapper>
        <div>Authenticated as {token}</div>
        {token && (
          <button type="button" onClick={handleLogout}>
            Sign Out
          </button>
        )}
        <div>
          <Outlet />
        </div>
      </ContentWrapper>
    </>
  )
}

export default Root
