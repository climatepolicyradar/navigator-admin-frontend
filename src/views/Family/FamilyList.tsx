import { Box } from '@chakra-ui/react'
import { useLoaderData } from 'react-router-dom'

import { getFamilies } from '@/api/Families'
import { TFamily } from '@/types/Family'

export async function loader() {
  const families = await getFamilies('')
  return { families }
}

export default function FamilyList() {
  const { families } = useLoaderData() as { families: TFamily[] }
  console.log(families)

  return (
    <>
      <Box>Family List</Box>
      <Box></Box>
    </>
  )
}
