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

interface IMcfProjectsBaseMetadata extends IMetadata {
  region: string[]
  implementing_agency: string[]
  status: string[]
  project_id: string[]
  project_url: string[]
  project_value_co_financing: string[]
  project_value_fund_spend: string[]
}

export interface IAfProjectsMetadata extends IMcfProjectsBaseMetadata {
  sector: string[]
}

export interface ICifProjectsMetadata extends IMcfProjectsBaseMetadata {
  sector: string[]
}

export interface IGefProjectsMetadata extends IMcfProjectsBaseMetadata {
  focal_area: string[]
}

export interface IGcfProjectsMetadata extends IMcfProjectsBaseMetadata {
  approved_ref: string[]
  result_area: string[]
  result_type: string[]
  sector: string[]
  theme: string[]
}

export interface IReportsMetadata extends IMetadata {
  author: string[]
  author_type: string[]
  external_id: string[]
}

type TMcfProjectsMetadata =
  | IAfProjectsMetadata
  | IGefProjectsMetadata
  | IGcfProjectsMetadata
  | ICifProjectsMetadata

export type TFamilyMetadata =
  | IInternationalAgreementsMetadata
  | ILawsAndPoliciesMetadata
  | TMcfProjectsMetadata
  | IReportsMetadata

// Read DTOs.
interface IFamilyBase {
  import_id: string
  title: string
  summary: string
  geography: string
  geographies: string[]
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

interface IAfProjectsFamily extends IFamilyBase {
  metadata: IAfProjectsMetadata
}

interface ICifProjectsFamily extends IFamilyBase {
  metadata: ICifProjectsMetadata
}

interface IGefProjectsFamily extends IFamilyBase {
  metadata: IGefProjectsMetadata
}

interface IGcfProjectsFamily extends IFamilyBase {
  metadata: IGcfProjectsMetadata
}

interface IReportsFamily extends IFamilyBase {
  metadata: IReportsMetadata
}

type TMcfFamily =
  | IAfProjectsFamily
  | IGefProjectsFamily
  | IGcfProjectsFamily
  | ICifProjectsFamily

export type TFamily =
  | IInternationalAgreementsFamily
  | ILawsAndPoliciesFamily
  | TMcfFamily
  | IReportsFamily

// DTO for Create and Write.
export interface IFamilyFormPostBase {
  title: string
  summary: string
  geography: string
  geographies: string[]
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
export interface IAfProjectsFamilyFormPost extends IFamilyFormPostBase {
  metadata: IAfProjectsMetadata
}

export interface ICifProjectsFamilyFormPost extends IFamilyFormPostBase {
  metadata: ICifProjectsMetadata
}

export interface IGefProjectsFamilyFormPost extends IFamilyFormPostBase {
  metadata: IGefProjectsMetadata
}

export interface IGcfProjectsFamilyFormPost extends IFamilyFormPostBase {
  metadata: IGcfProjectsMetadata
}

export interface IReportsFamilyFormPost extends IFamilyFormPostBase {
  metadata: IReportsMetadata
}

type TMcfFamilyFormPost =
  | IAfProjectsFamilyFormPost
  | IGefProjectsFamilyFormPost
  | IGcfProjectsFamilyFormPost
  | ICifProjectsFamilyFormPost

export type TFamilyFormPost =
  | ILawsAndPoliciesFamilyFormPost
  | IInternationalAgreementsFamilyFormPost
  | TMcfFamilyFormPost
  | IReportsFamilyFormPost
