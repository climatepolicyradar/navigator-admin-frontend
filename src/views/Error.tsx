import { useNavigate, useRouteError } from 'react-router-dom'

import { IError, IDetailedError } from '@/interfaces'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

const ErrorDetail = (errorDetail: string | IDetailedError[]) => {
  if (typeof errorDetail === 'string') return errorDetail

  return errorDetail.map((error, i) => (
    <span key={i}>
      <b>Error type: {error.type}</b>, on{' '}
      {error.loc.map((loc) => loc).join(', ')}.
      <br />
      <b>Message:</b> {error.msg}
    </span>
  ))
}

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
        <i>{error.message || ErrorDetail(error.detail)}</i>
      </p>
    </div>
  )
}
