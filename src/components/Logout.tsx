import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Logout() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
    navigate(0)
  }

  return (
    <>
      {token && (
        <button type='button' onClick={handleLogout}>
          Sign Out
        </button>
      )}
    </>
  )
}
