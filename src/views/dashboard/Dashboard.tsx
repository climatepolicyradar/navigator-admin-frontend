import { Link as ReactRouterLink } from 'react-router-dom'
import {
  Heading,
  Link,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Card,
  CardBody,
} from '@chakra-ui/react'
import useSummary from '@/hooks/useSummary'
import { Draft } from '@/components/WYSIWYG/Draft'

type TCardLink = {
  to: string
  children: React.ReactNode
}

const CardLink = ({ to, children }: TCardLink) => (
  <Link as={ReactRouterLink} to={to}>
    <Card>
      <CardBody>{children}</CardBody>
    </Card>
  </Link>
)

const Dashboard = () => {
  const { summary, loading, error } = useSummary()

  return (
    <Stack spacing={4}>
      <Heading as={'h1'}>Dashboard</Heading>
      {!loading && !error && (
        <SimpleGrid columns={2} gap="4">
          <CardLink to="/families">
            <Stat>
              <StatLabel>Families</StatLabel>
              <StatNumber>{summary?.n_families}</StatNumber>
              <StatHelpText>Click here to view Families</StatHelpText>
            </Stat>
          </CardLink>
          <CardLink to="/documents">
            <Stat>
              <StatLabel>Documents</StatLabel>
              <StatNumber>{summary?.n_documents}</StatNumber>
              <StatHelpText>Click here to view Documents</StatHelpText>
            </Stat>
          </CardLink>
          <CardLink to="/collections">
            <Stat>
              <StatLabel>Collections</StatLabel>
              <StatNumber>{summary?.n_collections}</StatNumber>
              <StatHelpText>Click here to view collections</StatHelpText>
            </Stat>
          </CardLink>
          <CardLink to="/events">
            <Stat>
              <StatLabel>Events</StatLabel>
              <StatNumber>{summary?.n_events}</StatNumber>
              <StatHelpText>Click here to view Events</StatHelpText>
            </Stat>
          </CardLink>
        </SimpleGrid>
      )}
      <Draft />
    </Stack>
  )
}

export default Dashboard
