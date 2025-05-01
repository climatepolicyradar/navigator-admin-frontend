import { createBrowserRouter, RouterProvider } from 'react-router-dom'

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
import CorpusTypeList from '@/components/lists/CorpusTypeList'
import { familyRoutes } from './familyRoutes'
import { collectionRoutes } from './collectionRoutes'
import CorpusTypes from '@/views/corpusTypes/CorpusTypes'
import CorpusType from '@/views/corpusTypes/CorpusType'
import OrganisationList from '@/components/lists/OrganisationList'
import Organisations from '@/views/organisation/Organisations'
import Organisation from '@/views/organisation/Organisation'
import { AppTokenForm } from '@/components/forms/AppTokenForm'

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
              {
                path: '/corpus-type/new',
                element: <CorpusType />,
                errorElement: <ErrorPage />,
              },
              {
                path: 'corpus-type/:name/edit',
                element: <CorpusType />,
                errorElement: <ErrorPage />,
              },
              {
                path: 'corpus-types',
                element: <CorpusTypes />,
                errorElement: <ErrorPage />,
                children: [
                  {
                    path: '',
                    element: <CorpusTypeList />,
                    errorElement: <ErrorPage />,
                  },
                ],
              },
              {
                path: '/organisation/new',
                element: <Organisation />,
                errorElement: <ErrorPage />,
              },
              {
                path: 'organisation/:id/edit',
                element: <Organisation />,
                errorElement: <ErrorPage />,
              },
              {
                path: 'organisations',
                element: <Organisations />,
                errorElement: <ErrorPage />,
                children: [
                  {
                    path: '',
                    element: <OrganisationList />,
                    errorElement: <ErrorPage />,
                  },
                ],
              },
              {
                path: '/app-tokens/new',
                element: <AppTokenForm />,
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
  const router = createBrowserRouter([
    ...unauthenticatedRoutes,
    ...authenticatedRoutes,
  ])

  return <RouterProvider router={router} />
}

export default Routes
