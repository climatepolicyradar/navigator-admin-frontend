import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'

import { ProtectedRoute } from './ProtectedRoute'
import Root from '@/Root'
import Login from '@/views/auth/Login'
import Dashboard from '@/views/dashboard/Dashboard'
import ErrorPage from '@views/Error'
import Documents from '@/views/document/Documents'
import DocumentList from '@/components/lists/DocumentList'
import Document from '@/views/document/Document'
import Corpus from '@/views/corpus/Corpus'
import Corpora from '@/views/corpus/Corpora'
import CorpusList from '@/components/lists/CorpusList'
import { familyRoutes } from './familyRoutes'
import { collectionRoutes } from './collectionRoutes'

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
              ...collectionRoutes,
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
              {
                path: '/corpus/new',
                element: <Corpus />,
                errorElement: <ErrorPage />,
              },
              {
                path: 'corpus/:importId/edit',
                element: <Corpus />,
                errorElement: <ErrorPage />,
              },
              {
                path: 'corpora',
                element: <Corpora />,
                errorElement: <ErrorPage />,
                children: [
                  {
                    path: '',
                    element: <CorpusList />,
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
