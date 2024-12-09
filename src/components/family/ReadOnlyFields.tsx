import React from 'react'
import { Box, Text, VStack, Divider } from '@chakra-ui/react'
import { TFamily } from '@/interfaces'

interface ReadOnlyFieldsProps {
  family: TFamily
}

export const ReadOnlyFields: React.FC<ReadOnlyFieldsProps> = ({ family }) => {
  return (
    <>
      <Box borderWidth='1px' borderRadius='lg' p={4} bg='gray.50'>
        <VStack align='stretch' spacing={3}>
          <Text>
            <strong>Owner:</strong> {family.organisation}
          </Text>
          <Divider />
          <Text>
            <strong>Corpus ID:</strong> {family.corpus_import_id}
          </Text>
          <Divider />
          <Text>
            <strong>Corpus Name:</strong> {family.corpus_title}
          </Text>
          <Divider />
          <Text>
            <strong>Corpus Type:</strong> {family.corpus_type}
          </Text>
          <Divider />
          <Text>
            <strong>Created At:</strong>{' '}
            {new Date(family.created).toLocaleString()}
          </Text>
          {family.last_modified && (
            <>
              <Divider />
              <Text>
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
