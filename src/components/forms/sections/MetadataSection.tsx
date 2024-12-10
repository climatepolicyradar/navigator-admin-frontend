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
      const metadataValues = Object.entries(
        loadedFamily.metadata as TFamilyMetadata,
      ).reduce<IFormMetadata>((acc, [key, value]) => {
        const fieldConfig =
          CORPUS_METADATA_CONFIG[corpusInfo.corpus_type]?.renderFields?.[key]
        if (!fieldConfig) return acc

        if (fieldConfig.type === FieldType.SINGLE_SELECT) {
          acc[key] = value?.[0]
            ? {
                value: value[0],
                label: value[0],
              }
            : undefined
        } else if (fieldConfig.type === FieldType.MULTI_SELECT) {
          acc[key] = value?.map((v) => ({
            value: v,
            label: v,
          }))
        } else {
          acc[key] = value
        }

        return acc
      }, {})

      reset((formValues: IFamilyFormBase) => ({
        ...formValues,
        ...metadataValues,
      }))
    }
  }, [loadedFamily, corpusInfo, reset])

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
