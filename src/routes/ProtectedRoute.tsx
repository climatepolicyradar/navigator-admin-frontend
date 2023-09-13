import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'

export const ProtectedRoute = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}
