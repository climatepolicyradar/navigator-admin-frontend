import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Logout() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    // Wait for next tick to ensure token cleanup has completed
    setTimeout(() => {
      navigate('/', { replace: true })
    }, 0)
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
