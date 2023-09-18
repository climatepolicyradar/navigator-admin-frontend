import { useNavigate, useRouteError } from 'react-router-dom'

import { IError } from '@/interfaces'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function ErrorPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const error = useRouteError() as IError

  useEffect(() => {
    if (error.status === 401) {
      logout(error.returnPage)
      navigate('/', { replace: true })
    }
  }, [error, navigate, logout])

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.detail || error.message}</i>
      </p>
    </div>
  )
}
