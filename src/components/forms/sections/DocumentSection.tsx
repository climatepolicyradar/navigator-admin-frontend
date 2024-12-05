import React from 'react'
import {
  Box,
  Button,
  Divider,
  AbsoluteCenter,
  Flex,
  Text,
} from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import { FamilyDocument } from '@/components/family/FamilyDocument'
import { IDocument } from '@/interfaces'

interface DocumentSectionProps {
  familyDocuments: string[]
  userCanModify: boolean
  onAddNew: (type: 'document') => void
  onEdit: (type: 'document', document: IDocument) => void
  onDelete: (documentId: string) => void
  updatedDocument: string
  setUpdatedDocument: (id: string) => void
  isNewFamily: boolean
}

export const DocumentSection: React.FC<DocumentSectionProps> = ({
  familyDocuments,
  userCanModify,
  onAddNew,
  onEdit,
  onDelete,
  updatedDocument,
  setUpdatedDocument,
  isNewFamily,
}) => {
  return (
    <>
      <Box position='relative' padding='10'>
        <Divider />
        <AbsoluteCenter bg='gray.50' px='4'>
          Documents
        </AbsoluteCenter>
      </Box>

      {isNewFamily && (
        <Text>
          Please create the family first before attempting to add documents
        </Text>
      )}

      {familyDocuments.length > 0 && (
        <Flex direction='column' gap={4}>
          {familyDocuments.map((documentId) => (
            <FamilyDocument
              key={documentId}
              documentId={documentId}
              canModify={userCanModify}
              onEditClick={(doc) => onEdit('document', doc)}
              onDeleteClick={onDelete}
              updatedDocument={updatedDocument}
              setUpdatedDocument={setUpdatedDocument}
            />
          ))}
        </Flex>
      )}

      {!isNewFamily && (
        <Box>
          <Button
            isDisabled={!userCanModify}
            onClick={() => onAddNew('document')}
            rightIcon={
              familyDocuments.length === 0 ? (
                <WarningIcon
                  color='red.500'
                  data-test-id='warning-icon-document'
                />
              ) : undefined
            }
          >
            Add new Document
          </Button>
        </Box>
      )}
    </>
  )
}
