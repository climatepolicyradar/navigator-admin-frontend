import ErrorPage from '@views/Error'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Root from '@/Root'
import { AppTokenForm } from '@/components/forms/AppTokenForm'
import CorpusList from '@/components/lists/CorpusList'
import CorpusTypeList from '@/components/lists/CorpusTypeList'
import DocumentList from '@/components/lists/DocumentList'
import OrganisationList from '@/components/lists/OrganisationList'
import Login from '@/views/auth/Login'
import Corpora from '@/views/corpus/Corpora'
import Corpus from '@/views/corpus/Corpus'
import CorpusType from '@/views/corpusTypes/CorpusType'
import CorpusTypes from '@/views/corpusTypes/CorpusTypes'
import Dashboard from '@/views/dashboard/Dashboard'
import Document from '@/views/document/Document'
import Documents from '@/views/document/Documents'
import Organisation from '@/views/organisation/Organisation'
import Organisations from '@/views/organisation/Organisations'

import { ProtectedRoute } from './ProtectedRoute'
import { collectionRoutes } from './collectionRoutes'
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
