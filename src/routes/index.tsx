import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'

import Root from '@/Root'
import Login from '@/views/auth/Login'
import Dashboard from '@/views/dashboard/Dashboard'
import ErrorPage from '@views/Error'
import FamilyEdit, {
  loader as familyEditLoader,
} from '@/views/family/FamilyEdit'
import Families from '@/views/family/Families'
import FamilyList, { loader as familiesLoader } from '@components/FamilyList'
import { ProtectedRoute } from './ProtectedRoute'

const authenticatedRoutes = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
          {
            errorElement: <ErrorPage />,
            children: [
              {
                path: '',
                element: <Dashboard />,
                errorElement: <ErrorPage />,
              },
              {
                path: 'family/:importId/edit',
                element: <FamilyEdit />,
                loader: familyEditLoader,
                errorElement: <ErrorPage />,
              },
              {
                path: 'families',
                element: <Families />,
                errorElement: <ErrorPage />,
                children: [
                  {
                    path: '',
                    element: <FamilyList />,
                    loader: familiesLoader,
                    errorElement: <ErrorPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

const unauthenticatedRoutes = [
  {
    path: 'login',
    element: <Login />,
  },
]

const Routes = () => {
  const { token } = useAuth()

  const router = createBrowserRouter([
    ...(!token ? unauthenticatedRoutes : []),
    ...authenticatedRoutes,
  ])

  return <RouterProvider router={router} />
}

export default Routes
