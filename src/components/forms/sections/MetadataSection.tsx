import { useEffect } from 'react'
import { Control, FieldErrors, UseFormReset } from 'react-hook-form'
import { Box, Divider, AbsoluteCenter } from '@chakra-ui/react'
import { DynamicMetadataFields } from '../DynamicMetadataFields'
import {
  CORPUS_METADATA_CONFIG,
  FieldType,
  IFormMetadata,
} from '@/interfaces/Metadata'
import {
  IConfigCorpora,
  TFamily,
  TFamilyMetadata,
  TTaxonomy,
} from '@/interfaces'
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
  loadedFamily,
  reset,
}: TProps) => {
  useEffect(() => {
    if (loadedFamily?.metadata && corpusInfo) {
      console.log('Populating the form fields')

      // This is populating the metadata form fields by transforming the metadata from the loaded family
      // into the format that the form expects.
      const metadataValues = Object.entries(
        loadedFamily.metadata as TFamilyMetadata,
      ).reduce<IFormMetadata>((loadedMetadata, [key, value]) => {
        const fieldConfig =
          CORPUS_METADATA_CONFIG[corpusInfo.corpus_type]?.renderFields?.[key]
        if (!fieldConfig) return loadedMetadata

        if (fieldConfig.type === FieldType.SINGLE_SELECT) {
          loadedMetadata[key] = value?.[0]
            ? {
                value: value[0],
                label: value[0],
              }
            : undefined
        } else if (fieldConfig.type === FieldType.MULTI_SELECT) {
          loadedMetadata[key] = value?.map((v) => ({
            value: v,
            label: v,
          }))
        } else {
          loadedMetadata[key] = value?.[0]
        }

        return loadedMetadata
      }, {})

      reset((formValues: IFamilyFormBase) => ({
        ...formValues,
        ...metadataValues,
      }))
    }
  }, [loadedFamily, corpusInfo, reset])

  if (!corpusInfo || !taxonomy) return null

  if (!loadedFamily?.metadata) return null // TODO Remove

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
        // TODO Check here if undefined is being passed in at any point before the real value is plugged in
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
