import { Link } from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'

export const BreadCrumbs = () => {
  return (
    <Breadcrumb fontSize='sm'>
      <BreadcrumbItem>
        <BreadcrumbLink to='/' fontWeight='bold' as={Link}>
          Climate Policy Radar Admin
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}
