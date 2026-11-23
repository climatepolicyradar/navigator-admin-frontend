import { Navigate, Outlet } from 'react-router-dom'
import useIsSuperUser from '@/hooks/useIsSuperUser'

export const SuperUserRoute = () => {
  const isSuperUser = useIsSuperUser()

  // redirect non-superusers to the dashboard
  if (!isSuperUser) {
    return <Navigate to='/' replace />
  }

  return <Outlet />
}
