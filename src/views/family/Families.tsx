import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  SkeletonText,
  Spacer,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { Select as CRSelect } from 'chakra-react-select'
import {
  Link,
  Form,
  Outlet,
  useNavigation,
  useSearchParams,
} from 'react-router-dom'

import { Loader } from '@/components/Loader'
import { SearchIcon } from '@chakra-ui/icons'
import useConfig from '@/hooks/useConfig'
import { getCountries } from '@/utils/extractNestedGeographyData'
import { chakraStylesSelect } from '@/styles/chakra'

const STATUSES = [
  { value: 'Created', label: 'Created' },
  { value: 'Published', label: 'Published' },
  { value: 'Deleted', label: 'Deleted' },
]

export default function Families() {
  const navigation = useNavigation()
  const { config, error: configError, loading: configLoading } = useConfig()
  const [searchParams, setSearchParams] = useSearchParams()
  const qGeography = searchParams.get('geography')
  const qStatus = searchParams.get('status')

  const countries = getCountries(config?.geographies).map((country) => {
    return { value: country.display_value, label: country.display_value }
  })

  const handleChangeGeo = (newValue: unknown) => {
    const selectedItem = newValue as { value: string; label: string }
    setSearchParams({
      geography: selectedItem?.value ?? '',
      q: searchParams.get('q') ?? '',
      status: qStatus ?? '',
    })
  }

  const handleChangeStatus = (newValue: unknown) => {
    const selectedItem = newValue as { value: string; label: string }
    setSearchParams({
      geography: qGeography ?? '',
      q: searchParams.get('q') ?? '',
      status: selectedItem?.value ?? '',
    })
  }

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const q = formData.get('q') as string
    setSearchParams({
      q,
      status: qStatus ?? '',
      geography: qGeography ?? '',
    })
  }

  return (
    <Flex gap={4} height={'100%'} flexDirection={'column'}>
      <Flex alignItems='center'>
        <Box>
          <Heading as={'h1'}>Families</Heading>
        </Box>
        <Spacer />
        <ButtonGroup>
          <Button as={Link} colorScheme='blue' to='/family/new'>
            Add new Family
          </Button>
        </ButtonGroup>
      </Flex>
      <Box bg={'gray.50'} rounded={'lg'} p={4}>
        <Form id='search-form' role='search' onSubmit={handleSearch}>
          <Flex gap={8}>
            <Box>
              <Text>Search within document titles and summaries</Text>
              <HStack spacing='0'>
                <Input
                  bg='white'
                  id='q'
                  placeholder='Search'
                  type='search'
                  name='q'
                  defaultValue={searchParams.get('q') ?? ''}
                  roundedRight={0}
                  maxW='600px'
                />
                <IconButton
                  type='submit'
                  aria-label='Search database'
                  icon={<SearchIcon />}
                  roundedLeft={0}
                />
              </HStack>
            </Box>
            <Box minW={300}>
              {configLoading && (
                <>
                  <Text>Loading geographies</Text>
                  <Spinner />
                </>
              )}
              {!configLoading && !configError && (
                <>
                  <Text>Geography</Text>
                  <CRSelect
                    chakraStyles={chakraStylesSelect}
                    isClearable={true}
                    isMulti={false}
                    isSearchable={true}
                    options={countries}
                    onChange={handleChangeGeo}
                    defaultValue={
                      qGeography && {
                        value: qGeography,
                        label: qGeography,
                      }
                    }
                  />
                </>
              )}
            </Box>
            <Box minW={200}>
              <Text>Status</Text>
              <CRSelect
                chakraStyles={chakraStylesSelect}
                isClearable={true}
                isMulti={false}
                isSearchable={true}
                options={STATUSES}
                onChange={handleChangeStatus}
                defaultValue={qStatus && { value: qStatus, label: qStatus }}
              />
            </Box>
          </Flex>
        </Form>
      </Box>

      {navigation.state === 'loading' ? (
        <Box padding='4' bg='white'>
          <Loader />
          <SkeletonText mt='4' noOfLines={3} spacing='4' skeletonHeight='2' />
        </Box>
      ) : (
        <Outlet />
      )}
    </Flex>
  )
}
