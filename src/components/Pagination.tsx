import { Flex, Button, IconButton } from '@chakra-ui/react'
import {
  GoArrowLeft,
  GoArrowRight,
  GoMoveToEnd,
  GoMoveToStart,
} from 'react-icons/go'

export const Pagination = () => {
  return (
    <Flex direction="row" mt="4" justify="center" gap="2">
      <IconButton size="sm" aria-label="first" icon={<GoMoveToStart />} />
      <IconButton size="sm" aria-label="prev" icon={<GoArrowLeft />} />
      <Button size="sm" variant="solid">
        1
      </Button>
      <Button size="sm" variant="solid">
        2
      </Button>
      <Button size="sm" variant="solid">
        3
      </Button>
      <Button size="sm" variant="solid">
        4
      </Button>
      <Button size="sm" variant="solid">
        5
      </Button>
      <IconButton size="sm" aria-label="next" icon={<GoArrowRight />} />
      <IconButton size="sm" aria-label="last" icon={<GoMoveToEnd />} />
    </Flex>
  )
}
