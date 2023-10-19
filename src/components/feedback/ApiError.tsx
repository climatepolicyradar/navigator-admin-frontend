import { Box, Text } from '@chakra-ui/react'

import { IError } from '@/interfaces'

type TProps = {
  error: IError
}

export const ApiError = ({ error }: TProps) => {
  return (
    <Box padding="4" bg="white">
      <Text color={'red.500'}>{error.message}</Text>
      <Text fontSize="xs" color={'gray.500'}>
        {error.detail}
      </Text>
    </Box>
  )
}
