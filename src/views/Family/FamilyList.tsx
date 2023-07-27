import { Box } from '@chakra-ui/react'
import { useLoaderData } from 'react-router-dom'

// import { getFamilies } from '@/api/Families'
import { TFamily } from '@/types/Family'
import { FakeNetwork } from '@/api/Faker'

import { FAMILIES } from '@/data/Families'

export async function loader() {
  // TODO: replace with proper API call
  // const families = await getFamilies('')
  // return { families }
  await FakeNetwork()
  return { families: FAMILIES }
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
