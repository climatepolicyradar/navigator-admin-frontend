import {
  ActionFunctionArgs,
  Form,
  ParamParseKey,
  Params,
  useLoaderData,
} from 'react-router-dom'
import {
  Box,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  HStack,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Tag,
  Textarea,
  VStack,
  Text,
  TagCloseButton,
  TagLabel,
  Stack,
  Badge,
  Tooltip,
  Button,
} from '@chakra-ui/react'

import { TFamily } from '@/interfaces'
import { formatDate, formatDateISO } from '@/utils/Date'
import { SECTORS } from '@/data/Sectors'
import { CloseIcon } from '@chakra-ui/icons'
import { DOCUMENT_TYPES } from '@/data/DocTypes'
import { getFamily } from '@/api/Families'

const PathNames = {
  familyEdit: '/family/:importId/edit',
} as const

interface Args extends ActionFunctionArgs {
  params: Params<ParamParseKey<typeof PathNames.familyEdit>>
}

export async function loader({ params }: Args) {
  if (!params.importId) {
    return
  }
  const families = await getFamily(params.importId)
  return families
}

export default function FamilyEdit() {
  const {
    response: { data: family },
  } = useLoaderData() as { response: { data: TFamily } }

  return (
    <>
      <Flex alignItems="center" gap="4">
        <Heading as={'h1'}>Edit: {family.title}</Heading>
        <Tag size="sm">id: {family.import_id}</Tag>
        <Badge colorScheme="green" size="sm">
          {family.status}
        </Badge>
      </Flex>
      <Text fontSize="sm">
        Last updated: {formatDate(family.last_updated_date)}
      </Text>
      <Form>
        <Grid templateColumns="2fr 1fr" gap="4">
          <Box my={4} p={4} bg={'gray.50'} boxShadow="base">
            <VStack gap="6">
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input bg="white" defaultValue={family.title} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Summary</FormLabel>
                <Textarea
                  height={'300px'}
                  bg="white"
                  defaultValue={family.summary}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Published date</FormLabel>
                <Input
                  bg="white"
                  placeholder="Select Date and Time"
                  defaultValue={formatDateISO(family.published_date)}
                  type="date"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Geography</FormLabel>
                <Select background="white" defaultValue={family.geography}>
                  <option value="international">International</option>
                  <option value="geo">United Kingdom</option>
                  <option value="usa">United States of America</option>
                  <option value="canada">Canada</option>
                  <option value="mexico">Mexico</option>
                  <option value="brazil">Brazil</option>
                  <option value="argentina">Argentina</option>
                </Select>
              </FormControl>
              <FormControl as="fieldset">
                <FormLabel as="legend">Category</FormLabel>
                <RadioGroup defaultValue={family.category}>
                  <HStack gap={4}>
                    <Radio bg="white" value="Executive">
                      Executive
                    </Radio>
                    <Radio bg="white" value="Legislative">
                      Legislative
                    </Radio>
                    <Radio bg="white" value="Litigation">
                      Litigation
                    </Radio>
                    <Radio bg="white" value="UNFCCC">
                      UNFCCC
                    </Radio>
                  </HStack>
                </RadioGroup>
                <FormHelperText>
                  Executive: policy, Legislative: legislation
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>Collections</FormLabel>
                <Select background="white">
                  <option value="">Select a collection</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={`collection-${i}`}>
                      Col - {(Math.random() * 999).toFixed(0)}
                    </option>
                  ))}
                </Select>
                <FormHelperText>
                  You may select more than one collection, they are listed below
                </FormHelperText>
                <Stack my={2} spacing={2} direction="column">
                  {family.collections.map((collection) => (
                    <Box key={collection}>
                      <Tooltip
                        label="Remove collection"
                        placement="top-end"
                        hasArrow
                      >
                        <Button
                          variant="ghost"
                          size={'sm'}
                          leftIcon={<CloseIcon fontSize={'xs'} />}
                        >
                          {collection}
                        </Button>
                      </Tooltip>
                    </Box>
                  ))}
                </Stack>
              </FormControl>
            </VStack>
          </Box>
          <Box my={4} p={4} bg={'gray.50'} boxShadow="base">
            <Text mb={4}>Metadata</Text>
            <VStack gap="6">
              <FormControl>
                <FormLabel>Sectors</FormLabel>
                <Select background="white">
                  <option value="">Select a sector</option>
                  {SECTORS.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </Select>
                <HStack my={2} spacing={2}>
                  <Tag size="md" variant="solid" width={'auto'}>
                    <TagLabel>Sector</TagLabel>
                    <TagCloseButton />
                  </Tag>
                </HStack>
              </FormControl>
              <FormControl>
                <FormLabel>Document type</FormLabel>
                <Select background="white">
                  <option value="">Select a document type</option>
                  {DOCUMENT_TYPES.map((docType) => (
                    <option key={docType} value={docType}>
                      {docType}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </Box>
        </Grid>
      </Form>
    </>
  )
}
