import { Box, Divider, AbsoluteCenter, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Control, UseFormSetValue } from 'react-hook-form'

import { IChakraSelect, IConfigCorpora } from '@/interfaces'

import { ICorpusFormSubmit } from '../CorpusForm'
import { SelectField } from '../fields/SelectField'
import { TextField } from '../fields/TextField'

type TProps = {
  corpora: IConfigCorpora[]
  watchedOrganisation: { label?: string; value?: number }
  watchedImportIdPart1: { label?: string; value?: string } | null
  control: Control<ICorpusFormSubmit>
  setValue: UseFormSetValue<ICorpusFormSubmit>
}

export const ImportIdSection = ({
  corpora,
  watchedOrganisation,
  watchedImportIdPart1,
  control,
  setValue,
}: TProps) => {
  const [selectOptions, setSelectOptions] = useState<IChakraSelect[]>([])

  useEffect(() => {
    if (watchedOrganisation) {
      // Find the corresponding corpus based on the watched organisation ID
      const matchedCorpus = corpora?.find(
        (corpus) => corpus.organisation?.id === watchedOrganisation?.value,
      )

      // If a matched corpus is found, create the options based on its name and type
      const filteredOptions: IChakraSelect[] = matchedCorpus
        ? [
            {
              label: matchedCorpus.organisation?.name,
              value: matchedCorpus.organisation?.name,
            },
            {
              label: matchedCorpus.organisation?.type,
              value: matchedCorpus.organisation?.type,
            },
          ]
        : [] // Empty array if no matched corpus is found

      setSelectOptions(filteredOptions)

      // Clear the value of import_id_part1 when organisation changes
      setValue('import_id_part1', null)
    } else {
      setValue('import_id_part1', null)
      setSelectOptions([])
    }
  }, [watchedOrganisation, corpora, setValue])

  useEffect(() => {
    if (watchedOrganisation && watchedImportIdPart1) {
      // Find the corresponding corpus based on the watched organisation ID
      const matchedCorpus = corpora?.find(
        (corpus) => corpus.organisation?.id === watchedOrganisation?.value,
      )

      if (watchedImportIdPart1?.value === matchedCorpus?.organisation?.type)
        setValue('import_id_part3', matchedCorpus?.organisation?.name)
      else setValue('import_id_part3', 'i00000001')
    } else setValue('import_id_part3', 'i00000001')
  }, [watchedOrganisation, watchedImportIdPart1, corpora, setValue])

  return (
    <>
      <Box position='relative' padding='10'>
        <Divider />
        <AbsoluteCenter bg='gray.50' px='4'>
          Import ID Builder
        </AbsoluteCenter>
      </Box>

      {!watchedOrganisation && (
        <Text>
          Please select an organisation first before attempting to build an
          import ID
        </Text>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <SelectField
          name='import_id_part1'
          label='Part 1'
          control={control}
          options={selectOptions}
          isRequired={true}
          isClearable={true}
        />

        <span style={{ margin: '0 8px' }}>·</span>

        <TextField
          name='import_id_part2'
          label='Part 2'
          control={control}
          showHelperText={false}
          isDisabled={true}
          isRequired={true}
        />
        <span style={{ margin: '0 8px' }}>·</span>

        <TextField
          name='import_id_part3'
          label='Part 3'
          control={control}
          isRequired={true}
        />

        <span style={{ margin: '0 8px' }}>·</span>

        <TextField
          name='import_id_part4'
          label='Part 4'
          control={control}
          isRequired={true}
        />
      </div>
    </>
  )
}
