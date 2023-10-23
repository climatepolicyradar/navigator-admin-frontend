import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'

export const BreadCrumbs = () => {
  const { pathname } = useLocation()
  const [currentPage, setCurrentPage] = useState<string | null | undefined>()

  useEffect(() => {
    if (pathname.includes('edit'))
      return setCurrentPage(pathname.split('/').reverse()[1])
    if (pathname.includes('new')) return setCurrentPage('New family')
    return setCurrentPage(null)
  }, [pathname])

  return (
    <Breadcrumb fontSize="sm">
      <BreadcrumbItem>
        <BreadcrumbLink to="/" fontWeight="bold" as={Link}>
          Climate Policy Radar Admin
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}
