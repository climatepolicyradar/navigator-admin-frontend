import { Control, FieldErrors, UseFormReset } from 'react-hook-form'
import { Box, Divider, AbsoluteCenter } from '@chakra-ui/react'
import { DynamicMetadataFields } from '../DynamicMetadataFields'
import { CORPUS_METADATA_CONFIG, FieldType } from '@/interfaces/Metadata'
import { IConfigCorpora, TFamily, TTaxonomy } from '@/interfaces'
import { IFamilyFormBase } from '../FamilyForm'

type TProps = {
  corpusInfo?: IConfigCorpora
  taxonomy?: TTaxonomy
  control: Control<IFamilyFormBase>
  errors: FieldErrors<IFamilyFormBase>
  loadedFamily?: TFamily
  reset: UseFormReset<IFamilyFormBase>
}

export const MetadataSection = ({
  corpusInfo,
  taxonomy,
  control,
  errors,
}: TProps) => {
  if (!corpusInfo || !taxonomy) return null

  return (
    <>
      <Box position='relative' padding='10'>
        <Divider />
        <AbsoluteCenter bg='gray.50' px='4'>
          Metadata
        </AbsoluteCenter>
      </Box>
      {Object.entries(
        (CORPUS_METADATA_CONFIG[corpusInfo.corpus_type]?.renderFields ||
          {}) as Record<string, { type: FieldType }>,
      ).map(([fieldKey, fieldConfig]) => (
        <DynamicMetadataFields
          key={fieldKey}
          fieldKey={fieldKey}
          taxonomyField={
            taxonomy[fieldKey] || {
              allow_blanks: true,
              allow_any: false,
            }
          }
          control={control}
          errors={errors}
          fieldType={fieldConfig.type}
        />
      ))}
    </>
  )
}
