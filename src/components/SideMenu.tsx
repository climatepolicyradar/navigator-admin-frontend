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
import { ChatIcon, HamburgerIcon, RepeatClockIcon } from '@chakra-ui/icons'
import { RiLogoutBoxRLine } from 'react-icons/ri'
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
          <DrawerHeader>Detail menu</DrawerHeader>

          <DrawerBody>
            <Stack divider={<StackDivider />} spacing="4">
              <nav>
                <IconLink icon={<RepeatClockIcon mr="2" />}>
                  View audit history
                </IconLink>
                <IconLink icon={<ChatIcon mr="2" />}>Add comment</IconLink>
                <IconLink icon={<Icon as={RiLogoutBoxRLine} mr="2" />}>
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
