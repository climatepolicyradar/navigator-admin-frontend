import { Box, Text } from '@chakra-ui/react'

import { IDetailedError, IError } from '@/interfaces'

type TProps = {
  error?: IError
  message?: string
  detail?: string
}

const renderErrorDetail = (errorDetail: string | IDetailedError[]) => {
  if (typeof errorDetail === 'string')
    return (
      <Text fontSize='xs' color={'gray.500'}>
        {errorDetail}
      </Text>
    )

  return errorDetail.map((error, i) => (
    <Text key={i} fontSize='xs' color={'gray.500'}>
      Error type: {error.type} <br /> On:{' '}
      {error.loc.map((loc) => loc).join(', ')} <br />
      Message: {error.msg}
    </Text>
  ))
}

export const ApiError = ({ error, message = '', detail = '' }: TProps) => {
  return (
    <Box padding='4' bg='white'>
      <Text color={'red.500'}>{error?.message || message}</Text>
      {renderErrorDetail(error?.detail || detail)}
    </Box>
  )
}
