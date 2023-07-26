import { Box } from '@chakra-ui/react'

type TProps = {
  children: React.ReactNode
}

export function ContentWrapper({ children }: TProps) {
  return (
    <>
      <Box p="4">{children}</Box>
    </>
  )
}
