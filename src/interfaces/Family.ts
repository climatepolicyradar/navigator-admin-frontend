import { TOrganisation } from './Organisation'

export interface IFamily {
  import_id: string
  title: string
  summary: string
  geography: string
  category: string
  status: string
  metadata: object
  slug: string
  events: string[]
  published_date: string
  last_updated_date: string
  documents: string[]
  collections: string[]
}

interface IFamilyBase {
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

interface IUNFCCCMetadata {
  author: string[]
  author_type: string[]
}

export interface IUNFCCCFamily extends IFamilyBase {
  metadata: IUNFCCCMetadata
  organisation: 'UNFCCC'
}

interface ICCLWMetadata {
  topic: string[]
  hazard: string[]
  sector: string[]
  keyword: string[]
  framework: string[]
  instrument: string[]
}

export interface ICCLWFamily extends IFamilyBase {
  metadata: ICCLWMetadata
  organisation: 'CCLW'
}
