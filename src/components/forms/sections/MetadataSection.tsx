import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Divider, AbsoluteCenter } from '@chakra-ui/react'
import { DynamicMetadataFields } from '../DynamicMetadataFields'
import {
  CORPUS_METADATA_CONFIG,
  FieldType,
  IMetadata,
} from '@/interfaces/Metadata'
import { IConfigCorpora, TFamily, TTaxonomy } from '@/interfaces'

type TProps = {
  corpusInfo?: IConfigCorpora
  taxonomy?: TTaxonomy
  loadedFamily?: TFamily
}

export const MetadataSection = ({
  corpusInfo,
  taxonomy,
  loadedFamily,
}: TProps) => {
  const {
    control,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (loadedFamily?.metadata && corpusInfo) {
      const metadataValues = Object.entries(
        loadedFamily.metadata as IMetadata,
      ).reduce<IMetadata>((acc, [fieldKey, value]) => {
        const fieldConfig =
          CORPUS_METADATA_CONFIG[corpusInfo.corpus_type]?.renderFields?.[
            fieldKey
          ]
        if (!fieldConfig) return acc

        if (fieldConfig.type === FieldType.SINGLE_SELECT) {
          acc[fieldKey] = value?.[0]
            ? {
                value: value[0],
                label: value[0],
              }
            : undefined
        } else if (fieldConfig.type === FieldType.MULTI_SELECT) {
          acc[fieldKey] = value?.map((v: string) => ({
            value: v,
            label: v,
          }))
        } else {
          acc[fieldKey] = value
        }

        return acc
      }, {})

      reset(metadataValues)
    }
  }, [loadedFamily, corpusInfo, reset])

  if (!corpusInfo || !taxonomy) return <></>

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
