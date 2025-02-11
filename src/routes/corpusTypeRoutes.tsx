import CorpusTypeList from '@/components/lists/CorpusTypeList'
import CorpusType from '@/views/corpusTypes/CorpusType'
import CorpusTypes from '@/views/corpusTypes/CorpusTypes'
import ErrorPage from '@/views/Error'

export const corpusTypeRoutes = [
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
]
