import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Logout() {
  const { token, setToken } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setToken()
    navigate('/', { replace: true })
  }

  return (
    <>
      {token && (
        <button type="button" onClick={handleLogout}>
          Sign Out
        </button>
      )}
    </>
  )
}
