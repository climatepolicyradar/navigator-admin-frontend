import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'

import Root from '@/Root'
import Login from '@/Login'
import ErrorPage from '@views/Error'
import FamilyEdit, {
  loader as familyEditLoader,
} from '@views/Family/FamilyEdit'
import Families from '@/views/Family/Families'
import FamilyList, { loader as familiesLoader } from '@components/FamilyList'

const authenticatedRoutes = [
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
            element: <>Hi, this is the root of the content area</>,
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

export default Routes;
