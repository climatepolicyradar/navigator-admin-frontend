import { IMetadata } from './Metadata'

// Metadata as stored on ReadDTO.
export interface IInternationalAgreementsMetadata extends IMetadata {
  author: string[]
  author_type: string[]
}

export interface ILawsAndPoliciesMetadata extends IMetadata {
  topic: string[]
  hazard: string[]
  sector: string[]
  keyword: string[]
  framework: string[]
  instrument: string[]
}

export type TFamilyMetadata =
  | IInternationalAgreementsMetadata
  | ILawsAndPoliciesMetadata

// Read DTOs.
interface IFamilyBase {
  import_id: string
  title: string
  summary: string
  geography: string
  category: string
  status: string
  slug: string
  events: string[]
  published_date: string | null
  last_updated_date: string | null
  documents: string[]
  collections: string[]
  organisation: string
  corpus_import_id: string
  corpus_title: string
  corpus_type: string
  created: string
  last_modified: string
}

export interface IInternationalAgreementsFamily extends IFamilyBase {
  metadata: IInternationalAgreementsMetadata
}

export interface ILawsAndPoliciesFamily extends IFamilyBase {
  metadata: ILawsAndPoliciesMetadata
}

export type TFamily = IInternationalAgreementsFamily | ILawsAndPoliciesFamily

// DTO for Create and Write.
export interface IFamilyFormPostBase {
  title: string
  summary: string
  geography: string
  category: string
  collections: string[]
  corpus_import_id: string
}

export interface ILawsAndPoliciesFamilyFormPost extends IFamilyFormPostBase {
  metadata: ILawsAndPoliciesMetadata
}

export interface IInternationalAgreementsFamilyFormPost
  extends IFamilyFormPostBase {
  metadata: IInternationalAgreementsMetadata
}

export type TFamilyFormPost =
  | ILawsAndPoliciesFamilyFormPost
  | IInternationalAgreementsFamilyFormPost
