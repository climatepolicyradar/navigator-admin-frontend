import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Spacer,
} from '@chakra-ui/react'
import { Link, Outlet } from 'react-router-dom'

export default function CorpusTypes() {
  return (
    <Flex gap={4} height={'100%'} flexDirection={'column'}>
      <Flex alignItems='center' gap='4'>
        <Box>
          <Heading as={'h1'}>Corpus Types</Heading>
        </Box>

        <Spacer />
        <ButtonGroup>
          <Button as={Link} colorScheme='blue' to='/corpus-type/new'>
            Add new Corpus Type
          </Button>
        </ButtonGroup>
      </Flex>
      <Outlet />
    </Flex>
  )
}
