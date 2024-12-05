import React, { useEffect } from 'react'
import { Control, FieldErrors, UseFormReset } from 'react-hook-form'
import { Box, Divider, AbsoluteCenter } from '@chakra-ui/react'
import { DynamicMetadataFields } from '../DynamicMetadataFields'
import { CORPUS_METADATA_CONFIG, FieldType } from '@/types/metadata'
import { IConfigCorpus, TFamily } from '@/interfaces'

interface MetadataSectionProps {
  corpusInfo: IConfigCorpus
  taxonomy: any
  control: Control<any>
  errors: FieldErrors<any>
  loadedFamily?: TFamily
  reset: UseFormReset<any>
}

export const MetadataSection: React.FC<MetadataSectionProps> = ({
  corpusInfo,
  taxonomy,
  control,
  errors,
  loadedFamily,
  reset,
}) => {
  useEffect(() => {
    if (loadedFamily?.metadata && corpusInfo) {
      const metadataValues = Object.entries(loadedFamily.metadata).reduce(
        (acc, [key, value]) => {
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
            acc[key] =
              value?.map((v) => ({
                value: v,
                label: v,
              })) || []
          } else if (
            fieldConfig.type === FieldType.TEXT ||
            fieldConfig.type === FieldType.NUMBER
          ) {
            acc[key] = value?.[0] || ''
          } else {
            acc[key] = value?.[0] || ''
          }
          return acc
        },
        {} as Record<string, any>,
      )

      reset((formValues) => ({
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
          taxonomyField={taxonomy[fieldKey] || {}}
          control={control}
          errors={errors}
          fieldType={fieldConfig.type}
        />
      ))}
    </>
  )
}
