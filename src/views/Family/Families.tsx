import { Box, Heading, Stack } from '@chakra-ui/react'
import { useLoaderData } from 'react-router-dom'

// import { getFamilies } from '@/api/Families'
import { TFamily } from '@/interfaces/Family'
import { FakeNetwork } from '@/api/Faker'
import FamilyList from '@/components/FamilyList'

import { FAMILIES } from '@/data/Families'

export async function loader() {
  // TODO: replace with proper API call
  // const families = await getFamilies('')
  // return { families }
  await FakeNetwork()
  return { families: FAMILIES }
}

export default function Families() {
  const { families } = useLoaderData() as { families: TFamily[] }
  // console.log(families)

  return (
    <Stack spacing={4}>
      <Heading as={'h1'}>Families</Heading>
      <FamilyList families={families} />
    </Stack>
  )
}
