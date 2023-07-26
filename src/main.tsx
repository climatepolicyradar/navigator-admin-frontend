import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import Root from '@/Root'
import ErrorPage from '@views/Error'
import FamilyEdit from '@views/Family/FamilyEdit'
import FamilyList, {
  loader as familyListLoader,
} from '@/views/Family/FamilyList'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'families/:id',
        element: <FamilyEdit />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'families',
        element: <FamilyList />,
        loader: familyListLoader,
        errorElement: <ErrorPage />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>,
)
