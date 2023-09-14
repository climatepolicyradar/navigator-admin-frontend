import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
  const { token, login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (login)
      await login({
        username: 'username',
        password: 'password',
      })
    navigate('/', { replace: true })
  }

  return (
    <>
      {token && <div>Authenticated as {token}</div>}
      <button type="button" onClick={() => void handleLogin()}>
        Sign In
      </button>
    </>
  )
}
