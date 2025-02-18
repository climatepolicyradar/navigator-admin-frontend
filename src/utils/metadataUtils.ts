import { IChakraSelect } from '@/interfaces'

export const formatFieldLabel = (key: string): string => {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export const generateSelectOptions = (values?: string[]): IChakraSelect[] => {
  if (!values) return []
  return values.map((value) => ({ value, label: value }))
}

export const isArrayField = (fieldType: string): boolean => {
  return fieldType.includes('multi_select')
}
