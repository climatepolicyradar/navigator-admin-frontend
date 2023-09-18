import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (login) {
      await login({
        username: '',
        password: '',
      }).then((returnTo) => {
        // TODO: set up return to
        // console.log(returnTo)
        navigate('/', { replace: true })
      })
    }
  }

  return (
    <>
      <button type="button" onClick={() => void handleLogin()}>
        Sign In
      </button>
    </>
  )
}
