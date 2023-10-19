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
import { HamburgerIcon } from '@chakra-ui/icons'
import { GoSignOut, GoComment, GoClock } from 'react-icons/go'
import Logout from './Logout'

const IconLink = ({
  icon,
  children,
}: {
  icon: JSX.Element
  children: JSX.Element | string
}) => (
  <Link
    display="flex"
    alignItems="center"
    py="1"
    px="2"
    borderRadius="md"
    _hover={{ background: 'gray.50' }}
  >
    {icon && icon}
    {children}
  </Link>
)

export function SideMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <IconButton
        variant="outline"
        colorScheme="gray"
        aria-label="Open menu"
        icon={<HamburgerIcon />}
        onClick={onOpen}
      />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent borderRightRadius="lg">
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>

          <DrawerBody>
            <Stack divider={<StackDivider />} spacing="4">
              <nav>
                <IconLink icon={<Icon as={GoClock} mr="2" />}>
                  View audit history
                </IconLink>
                <IconLink icon={<Icon as={GoComment} mr="2" />}>
                  Add comment
                </IconLink>
                <IconLink icon={<Icon as={GoSignOut} mr="2" />}>
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
