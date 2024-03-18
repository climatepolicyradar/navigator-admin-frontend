import { Box, HStack, Stack } from '@chakra-ui/react'

import { SideMenu } from './SideMenu'
import { BreadCrumbs } from './Breadcrumbs'

export function Header() {
  return (
    <>
      <Stack
        p='4'
        bg='gray.50'
        direction='column'
        borderBottom='1px'
        borderColor='gray.100'
        boxShadow='inner'
      >
        <Box>
          <HStack gap={6}>
            <SideMenu />
            <BreadCrumbs />
          </HStack>
        </Box>
      </Stack>
    </>
  )
}
