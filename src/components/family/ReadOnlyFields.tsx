import { Box, Text, VStack, Divider } from '@chakra-ui/react'
import { TFamily } from '@/interfaces'

type TProps = {
  family: TFamily
}

export const ReadOnlyFields = ({ family }: TProps) => {
  return (
    <>
      <Box borderWidth='1px' borderRadius='lg' p={4} bg='gray.50'>
        <VStack align='stretch' spacing={3}>
          <Text aria-label='family-import-id'>
            <strong>Family ID:</strong> {family.import_id}
          </Text>
          <Divider />
          <Text aria-label='organisation-name'>
            <strong>Owner:</strong> {family.organisation}
          </Text>
          <Divider />
          <Text aria-label='corpus-import-id'>
            <strong>Corpus ID:</strong> {family.corpus_import_id}
          </Text>
          <Divider />
          <Text aria-label='corpus-title'>
            <strong>Corpus Name:</strong> {family.corpus_title}
          </Text>
          <Divider />
          <Text aria-label='corpus-type'>
            <strong>Corpus Type:</strong> {family.corpus_type}
          </Text>
          <Divider />
          <Text aria-label='created-at'>
            <strong>Created At:</strong>{' '}
            {new Date(family.created).toLocaleString()}
          </Text>
          {family.last_modified && (
            <>
              <Divider />
              <Text aria-label='last-updated'>
                <strong>Last Updated:</strong>{' '}
                {new Date(family.last_modified).toLocaleString()}
              </Text>
            </>
          )}
        </VStack>
      </Box>
    </>
  )
}
