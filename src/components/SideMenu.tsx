/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Link,
  Stack,
  StackDivider,
  useDisclosure,
  Icon,
} from '@chakra-ui/react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { HamburgerIcon } from '@chakra-ui/icons'
import {
  GoHome,
  GoRepo,
  GoProjectRoadmap,
  GoVersions,
  GoSignOut,
  GoComment,
  GoClock,
} from 'react-icons/go'
import Logout from './Logout'

const IconLink = ({
  icon,
  children,
  to,
  current = false,
}: {
  icon: JSX.Element
  children: JSX.Element | string
  to?: string
  current?: boolean
}) => (
  <Link
    display='flex'
    alignItems='center'
    py='1'
    px='2'
    borderRadius='md'
    fontWeight={current ? 'bold' : 'normal'}
    _hover={{ background: 'gray.50' }}
    as={RouterLink}
    to={to}
  >
    {icon && icon}
    {children}
  </Link>
)

export function SideMenu() {
  const { pathname } = useLocation()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const isCurrentPage = (page: string) =>
    pathname.split('/').reverse()[0] === page

  return (
    <>
      <IconButton
        variant='outline'
        colorScheme='gray'
        aria-label='Open menu'
        icon={<HamburgerIcon />}
        onClick={onOpen}
      />
      <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent borderRightRadius='lg'>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>

          <DrawerBody>
            <Stack divider={<StackDivider />} spacing='4'>
              <nav onClick={onClose}>
                <IconLink
                  icon={<Icon as={GoHome} mr='2' />}
                  to='/'
                  current={isCurrentPage('')}
                >
                  Dashboard
                </IconLink>
                <IconLink
                  icon={<Icon as={GoRepo} mr='2' />}
                  to='/families'
                  current={isCurrentPage('families')}
                >
                  Families
                </IconLink>
                <IconLink
                  icon={<Icon as={GoProjectRoadmap} mr='2' />}
                  to='/documents'
                  current={isCurrentPage('documents')}
                >
                  Documents
                </IconLink>
                <IconLink
                  icon={<Icon as={GoVersions} mr='2' />}
                  to='/collections'
                  current={isCurrentPage('collections')}
                >
                  Collections
                </IconLink>
                <IconLink icon={<Icon as={GoClock} mr='2' />}>
                  View audit history
                </IconLink>
                <IconLink icon={<Icon as={GoComment} mr='2' />}>
                  Add comment
                </IconLink>
                <IconLink icon={<Icon as={GoSignOut} mr='2' />}>
                  <Logout />
                </IconLink>
              </nav>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
