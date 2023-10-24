import { Box, Text } from '@chakra-ui/react'

import { IError } from '@/interfaces'

type TProps = {
  error?: IError
  message?: string
  detail?: string
}

export const ApiError = ({ error, message = '', detail = '' }: TProps) => {
  return (
    <Box padding="4" bg="white">
      <Text color={'red.500'}>{error?.message || message}</Text>
      <Text fontSize="xs" color={'gray.500'}>
        {error?.detail || detail}
      </Text>
    </Box>
  )
}
