import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Code,
  Flex,
  Heading,
  Link,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react'
import { FiExternalLink } from 'react-icons/fi'

import { REQUIRED_FIELDS } from '@/utils/validateCsvColumns'

const ExternalLink = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => (
  <Link
    href={href}
    isExternal
    color='blue.600'
    display='inline-flex'
    alignItems='center'
    gap={1}
  >
    {children}
    <FiExternalLink size={12} aria-hidden />
  </Link>
)

const SectionHeader = ({ title }: { title: string }) => (
  <Heading as='h2' size='sm'>
    <AccordionButton px={4} py={3}>
      <Box flex='1' textAlign='left'>
        {title}
      </Box>
      <AccordionIcon />
    </AccordionButton>
  </Heading>
)

export default function UploadGuidance() {
  return (
    <Box
      as='aside'
      aria-label='Upload guidance'
      w={{ base: '100%', lg: '360px' }}
      flexShrink={0}
      alignSelf='flex-start'
      position={{ base: 'static', lg: 'sticky' }}
      top={6}
      borderWidth='1px'
      borderColor='gray.200'
      borderRadius='xl'
      bg='white'
      overflow='hidden'
    >
      <Box
        px={4}
        py={3}
        borderBottomWidth='1px'
        borderColor='gray.200'
        bg='gray.50'
      >
        <Heading as='h2' size='sm'>
          Before you upload
        </Heading>
        <Text mt={1} fontSize='xs' color='gray.500'>
          A quick checklist to avoid validation errors.
        </Text>
      </Box>

      <Accordion allowMultiple defaultIndex={[0]}>
        <AccordionItem border='none'>
          <SectionHeader title='Required columns' />
          <AccordionPanel px={4} pb={4}>
            <Text fontSize='sm' color='gray.600' mb={3}>
              Your file must include a header row containing all of these
              columns, in this specific order:
            </Text>
            <Box
              maxH='50vh'
              overflowY='auto'
              pr={2}
              tabIndex={0}
              role='region'
              aria-label='Required columns'
            >
              <List spacing={2}>
                {REQUIRED_FIELDS.map((field) => (
                  <ListItem key={field.name} fontSize='sm'>
                    <Code colorScheme='blue'>{field.name}</Code>
                    <Text as='span' color='gray.500'>
                      {' '}
                      – {field.description}
                    </Text>
                  </ListItem>
                ))}
              </List>
            </Box>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <SectionHeader title='ISO codes' />
          <AccordionPanel px={4} pb={4} fontSize='sm' color='gray.700'>
            <Text mb={2}>
              Geographies and languages must use standard ISO codes, not free
              text.
            </Text>
            <List spacing={2}>
              <ListItem>
                <strong>Geographies:</strong> ISO 3166 codes (e.g.{' '}
                <Code>JAM</Code>).{' '}
                <ExternalLink href='https://www.iso.org/iso-3166-country-codes.html'>
                  ISO Country Codes
                </ExternalLink>
              </ListItem>
              <ListItem>
                <strong>Languages:</strong> two-letter ISO 639-2 codes (e.g.{' '}
                <Code>LIT</Code>).{' '}
                <ExternalLink href='https://www.loc.gov/standards/iso639-2/php/English_list.php'>
                  Library of Congress code list
                </ExternalLink>
              </ListItem>
            </List>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <SectionHeader title='Child documents' />
          <AccordionPanel px={4} pb={4} fontSize='sm' color='gray.700'>
            Every child document must have a value in{' '}
            <Code>parent_document_id</Code>. Rows without one will be rejected.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem borderBottom='none'>
          <SectionHeader title='Names and codes go together' />
          <AccordionPanel px={4} pb={4} fontSize='sm' color='gray.700'>
            <Text mb={2}>
              For both geographies and languages, fill in the name <em>and</em>{' '}
              the code, or leave both empty.
            </Text>
            <Flex direction='column' gap={1}>
              <Text>✅ name + code both present</Text>
              <Text>✅ name + code both empty</Text>
              <Text>❌ name without code, or code without name</Text>
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  )
}
