import { TOrganisation } from './Organisation'

interface IFamilyBase {
  import_id: string
  title: string
  summary: string
  geography: string
  category: string
  status: string
  slug: string
  events: string[]
  published_date: string
  last_updated_date: string
  documents: string[]
  collections: string[]
  organisation: TOrganisation
}

export interface IUNFCCCMetadata {
  author: string[]
  author_type: string[]
}

export interface ICCLWMetadata {
  topic: string[]
  hazard: string[]
  sector: string[]
  keyword: string[]
  framework: string[]
  instrument: string[]
}

export interface IUNFCCCFamily extends IFamilyBase {
  metadata: IUNFCCCMetadata
  organisation: 'UNFCCC'
}

export interface ICCLWFamily extends IFamilyBase {
  metadata: ICCLWMetadata
  organisation: 'CCLW'
}

export type TFamily = IUNFCCCFamily | ICCLWFamily

interface IFamilyFormPostBase {
  import_id: string
  title: string
  summary: string
  geography: string
  category: string
  organisation: string
  collections: string[]
}

export interface ICCLWFamilyFormPost extends IFamilyFormPostBase {
  organisation: 'CCLW'
  metadata: ICCLWMetadata
}

export interface IUNFCCCFamilyFormPost extends IFamilyFormPostBase {
  organisation: 'UNFCCC'
  metadata: IUNFCCCMetadata
}

export type TFamilyFormPostMetadata = IUNFCCCMetadata | ICCLWMetadata

export type TFamilyFormPost = ICCLWFamilyFormPost | IUNFCCCFamilyFormPost
