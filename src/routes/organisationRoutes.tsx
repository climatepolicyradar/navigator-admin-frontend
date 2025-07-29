import OrganisationList from '@/components/lists/OrganisationList'
import ErrorPage from '@/views/Error'
import Organisation from '@/views/organisation/Organisation'
import Organisations from '@/views/organisation/Organisations'

export const organisationRoutes = [
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
]
