import { Link, useLocation } from 'react-router-dom'
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  Stack,
} from '@chakra-ui/react'

import { SideMenu } from './SideMenu'
import { useEffect, useState } from 'react'

export function Header() {
  const { pathname } = useLocation()
  const [currentPage, setCurrentPage] = useState<string | null | undefined>()

  useEffect(() => {
    if (pathname.includes('edit'))
      return setCurrentPage('Edit: ' + pathname.split('/').reverse()[1])
    if (pathname.includes('new')) return setCurrentPage('New family')
    return setCurrentPage(null)
  }, [pathname])

  return (
    <>
      <Stack
        p="4"
        bg="gray.50"
        direction="column"
        borderBottom="1px"
        borderColor="gray.100"
        boxShadow="inner"
      >
        <Box>
          <HStack>
            <SideMenu />
            <Breadcrumb fontSize="sm">
              <BreadcrumbItem>
                <BreadcrumbLink to="/" fontWeight="bold" as={Link}>
                  Climate Policy Radar
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink to="/families" fontWeight="bold" as={Link}>
                  Families
                </BreadcrumbLink>
              </BreadcrumbItem>
              {/* <BreadcrumbItem>
                <BreadcrumbLink
                  to="/family/sample1"
                  fontWeight="bold"
                  as={Link}
                >
                  Family
                </BreadcrumbLink>
              </BreadcrumbItem> */}
              {currentPage && (
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink>{currentPage}</BreadcrumbLink>
                </BreadcrumbItem>
              )}
            </Breadcrumb>
          </HStack>
        </Box>
      </Stack>
    </>
  )
}
