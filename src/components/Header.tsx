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
                <BreadcrumbLink href="/" fontWeight="bold">
                  Climate Policy Radar
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/families" fontWeight="bold">
                  Families
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#">Edit family</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </HStack>
        </Box>
      </Stack>
    </>
  )
}
