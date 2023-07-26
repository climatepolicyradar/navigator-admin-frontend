import { Link } from 'react-router-dom'
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  Stack,
} from '@chakra-ui/react'

import { SideMenu } from './SideMenu'

export function Header() {
  return (
    <>
      <Stack
        p="4"
        bg="gray.50"
        direction="column"
        borderBottom="1px"
        borderColor="gray.100"
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
              <BreadcrumbItem>
                <BreadcrumbLink to="/families/sample1" fontWeight="bold" as={Link}>
                  Family
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>Edit</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </HStack>
        </Box>
      </Stack>
    </>
  )
}
