import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import Root from '@/Root'
import ErrorPage from '@views/Error'
import FamilyEdit, {
  loader as familyEditLoader,
} from '@views/Family/FamilyEdit'
import Families, { loader as familiesLoader } from '@/views/Family/Families'

const router = createBrowserRouter([
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
            element: <>Hi, this is the root of the content area</>,
            errorElement: <ErrorPage />,
          },
          {
            path: 'families/:importId',
            element: <FamilyEdit />,
            loader: familyEditLoader,
            errorElement: <ErrorPage />,
          },
          {
            path: 'families',
            element: <Families />,
            loader: familiesLoader,
            errorElement: <ErrorPage />,
          },
        ],
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
