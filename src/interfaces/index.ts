export * from './Auth'
export * from './Config'
export * from './Collection'
export * from './Corpus'
export * from './Document'
export * from './Event'
export * from './Family'
export * from './Summary'

import { OptionBase } from 'chakra-react-select'

export interface IChakraSelect extends OptionBase {
  value: string
  label: string
}
