import { useLoaderData } from 'react-router-dom'
import { Heading, Text } from '@chakra-ui/react'

import { FakeNetwork } from '@/api/Faker'
import { FAMILIES } from '@/data/Families'
import { TFamily } from '@/interfaces'

export async function loader({ params }) {
  // TODO: replace with proper API call
  // const families = await getFamilies('')
  // return { families }
  await FakeNetwork()
  return {
    family: FAMILIES.find((family) => family.import_id === params.importId),
  }
}

export default function FamilyEdit() {
  const { family } = useLoaderData() as { family: TFamily }
  console.log(family)

  return (
    <>
      <Heading as={'h1'}>{family.title}</Heading>
      <Text>{family.summary}</Text>
    </>
  )
}
