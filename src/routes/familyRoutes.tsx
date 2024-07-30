import FamilyList, {
  loader as familiesLoader,
} from '@/components/lists/FamilyList'
import ErrorPage from '@/views/Error'
import Families from '@/views/family/Families'
import Family from '@/views/family/Family'

export const familyRoutes = [
  {
    path: '/family/new',
    element: <Family />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'family/:importId/edit',
    element: <Family />,
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
]
