import CollectionList from '@/components/lists/CollectionList'
import Collection from '@/views/collection/Collection'
import Collections from '@/views/collection/Collections'
import ErrorPage from '@/views/Error'

export const collectionRoutes = [
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
]
