import UserList from '@/components/lists/UserList'
import ErrorPage from '@/views/Error'
import User from '@/views/user/User'
import Users from '@/views/user/Users'

export const userRoutes = [
  {
    path: 'user/:email',
    element: <User />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'users',
    element: <Users />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <UserList />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]
