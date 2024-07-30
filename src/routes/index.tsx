import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'

import { ProtectedRoute } from './ProtectedRoute'
import Root from '@/Root'
import Login from '@/views/auth/Login'
import Dashboard from '@/views/dashboard/Dashboard'
import ErrorPage from '@views/Error'
import Collections from '@/views/collection/Collections'
import CollectionList from '@/components/lists/CollectionList'
import Collection from '@/views/collection/Collection'
import Documents from '@/views/document/Documents'
import DocumentList from '@/components/lists/DocumentList'
import Document from '@/views/document/Document'
import { familyRoutes } from './familyRoutes'

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
              ...familyRoutes,
              {
                path: '/collection/new',
                element: <Collection />,
                errorElement: <ErrorPage />,
              },
              {
                path: 'collection/:importId/edit',
                element: <Collection />,
                errorElement: <ErrorPage />,
              },
              {
                path: 'collections',
                element: <Collections />,
                errorElement: <ErrorPage />,
                children: [
                  {
                    path: '',
                    element: <CollectionList />,
                    errorElement: <ErrorPage />,
                  },
                ],
              },
              {
                path: 'document/:importId/edit',
                element: <Document />,
                errorElement: <ErrorPage />,
              },
              {
                path: 'documents',
                element: <Documents />,
                errorElement: <ErrorPage />,
                children: [
                  {
                    path: '',
                    element: <DocumentList />,
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
