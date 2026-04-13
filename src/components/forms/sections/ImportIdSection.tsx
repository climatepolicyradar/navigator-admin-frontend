import { Box, Divider, AbsoluteCenter, Text } from '@chakra-ui/react'
import { IChakraSelect, IConfigCorpora } from '@/interfaces'
import { IOrganisation } from '@/interfaces/Organisation'
import { SelectField } from '../fields/SelectField'
import { TextField } from '../fields/TextField'
import { Control, UseFormSetValue } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { ICorpusFormSubmit } from '../CorpusForm'

/**
 * Builds dropdown options for import ID part 1 from the config corpus row when
 * present, otherwise from the organisations API (e.g. first corpus for that org).
 *
 * @param matchedCorpus - Corpus entry from config for the selected organisation.
 * @param selectedOrg - Organisation from GET /v1/organisations when no config row
 *   exists yet (creating the organisation's first corpus).
 * @returns Label/value pairs for the Part 1 select.
 */
function buildImportIdPart1Options(
  matchedCorpus: IConfigCorpora | undefined,
  selectedOrg: IOrganisation | undefined,
): IChakraSelect[] {
  if (matchedCorpus?.organisation) {
    const org = matchedCorpus.organisation
    return [
      { label: org.name, value: org.name },
      { label: org.type, value: org.type },
    ]
  }
  if (selectedOrg) {
    return [
      {
        label: selectedOrg.internal_name,
        value: selectedOrg.internal_name,
      },
      { label: selectedOrg.type, value: selectedOrg.type },
    ]
  }
  return []
}

/**
 * Resolves import-ID name and type used for part 3 defaults, preferring config.
 *
 * @param matchedCorpus - Corpus entry from config when present.
 * @param selectedOrg - Fallback organisation from the list API.
 * @returns Name and type aligned with backend config corpora organisation fields.
 */
function resolveImportIdNameAndType(
  matchedCorpus: IConfigCorpora | undefined,
  selectedOrg: IOrganisation | undefined,
): { name: string | undefined; type: string | undefined } {
  if (matchedCorpus?.organisation) {
    const org = matchedCorpus.organisation
    return { name: org.name, type: org.type }
  }
  if (selectedOrg) {
    return {
      name: selectedOrg.internal_name,
      type: selectedOrg.type,
    }
  }
  return { name: undefined, type: undefined }
}

type TProps = {
  corpora: IConfigCorpora[]
  organisations: IOrganisation[]
  watchedOrganisation: { label?: string; value?: number }
  watchedImportIdPart1: { label?: string; value?: string } | null
  control: Control<ICorpusFormSubmit>
  setValue: UseFormSetValue<ICorpusFormSubmit>
}

export const ImportIdSection = ({
  corpora,
  organisations,
  watchedOrganisation,
  watchedImportIdPart1,
  control,
  setValue,
}: TProps) => {
  const [selectOptions, setSelectOptions] = useState<IChakraSelect[]>([])

  useEffect(() => {
    if (watchedOrganisation) {
      const matchedCorpus = corpora?.find(
        (corpus) => corpus.organisation?.id === watchedOrganisation?.value,
      )
      const selectedOrg = organisations.find(
        (org) => org.id === watchedOrganisation?.value,
      )

      const filteredOptions = buildImportIdPart1Options(
        matchedCorpus,
        selectedOrg,
      )

      setSelectOptions(filteredOptions)

      // Clear the value of import_id_part1 when organisation changes
      setValue('import_id_part1', null)
    } else {
      setValue('import_id_part1', null)
      setSelectOptions([])
    }
  }, [watchedOrganisation, corpora, organisations, setValue])

  useEffect(() => {
    if (watchedOrganisation && watchedImportIdPart1) {
      const matchedCorpus = corpora?.find(
        (corpus) => corpus.organisation?.id === watchedOrganisation?.value,
      )
      const selectedOrg = organisations.find(
        (org) => org.id === watchedOrganisation?.value,
      )
      const { name, type } = resolveImportIdNameAndType(
        matchedCorpus,
        selectedOrg,
      )

      if (watchedImportIdPart1?.value === type)
        setValue('import_id_part3', name)
      else setValue('import_id_part3', 'i00000001')
    } else setValue('import_id_part3', 'i00000001')
  }, [
    watchedOrganisation,
    watchedImportIdPart1,
    corpora,
    organisations,
    setValue,
  ])

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
