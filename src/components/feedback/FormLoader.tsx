import { Box, SkeletonText } from '@chakra-ui/react'
import { Loader } from '@components/Loader'

type TProps = {
  skeletonHeight?: number
}

export const FormLoader = ({ skeletonHeight = 12 }: TProps) => {
  return (
    <Box padding="4" bg="white">
      <Loader />
      <SkeletonText
        mt="4"
        noOfLines={skeletonHeight}
        spacing="4"
        skeletonHeight="2"
      />
    </Box>
  )
}
