import { IFamilyFormBase } from '@/components/forms/FamilyForm'
import {
  IAfProjectsFamilyFormPost,
  IAfProjectsMetadata,
  IFamilyFormPostBase,
  IGefProjectsFamilyFormPost,
  IGefProjectsMetadata,
  IInternationalAgreementsMetadata,
  ILawsAndPoliciesMetadata,
  TFamilyFormPost,
  TFamilyMetadata,
  IInternationalAgreementsFamilyFormPost,
  ILawsAndPoliciesFamilyFormPost,
  IGcfProjectsMetadata,
  IGcfProjectsFamilyFormPost,
  ICifProjectsMetadata,
  ICifProjectsFamilyFormPost,
  IReportsMetadata,
  IReportsFamilyFormPost,
} from '../../../interfaces/Family'
import { IChakraSelect } from '@/interfaces'

// Type-safe metadata handler type
export type MetadataHandler<T extends TFamilyMetadata> = {
  extractMetadata: (formData: TFamilyFormSubmit) => T
  createSubmissionData: (
    baseData: IFamilyFormPostBase,
    metadata: T,
  ) => TFamilyFormPost
}

interface IFamilyFormIntlAgreements extends IFamilyFormBase {
  author?: string
  author_type?: IChakraSelect
}

interface IFamilyFormLawsAndPolicies extends IFamilyFormBase {
  topic?: IChakraSelect[]
  hazard?: IChakraSelect[]
  sector?: IChakraSelect[]
  keyword?: IChakraSelect[]
  framework?: IChakraSelect[]
  instrument?: IChakraSelect[]
}

interface IFamilyFormMcfProjects extends IFamilyFormBase {
  region?: IChakraSelect[]
  implementing_agency?: IChakraSelect[]
  status?: IChakraSelect
  project_id?: string
  project_url?: string
  project_value_co_financing?: string
  project_value_fund_spend?: string
}

interface IFamilyFormAfProjects extends IFamilyFormMcfProjects {
  sector?: IChakraSelect[]
}

interface IFamilyFormCifProjects extends IFamilyFormMcfProjects {
  sector?: IChakraSelect[]
}

interface IFamilyFormGcfProjects extends IFamilyFormMcfProjects {
  sector?: IChakraSelect[]
  result_area?: IChakraSelect[]
  result_type?: IChakraSelect[]
  theme?: IChakraSelect[]
  approved_ref?: string
}

interface IFamilyFormGefProjects extends IFamilyFormMcfProjects {
  focal_area?: IChakraSelect[]
}

interface IFamilyFormReports extends IFamilyFormBase {
  author?: string[]
  author_type?: IChakraSelect[]
  external_id?: string
}

type TFamilyFormMcfProjects =
  | IFamilyFormAfProjects
  | IFamilyFormGcfProjects
  | IFamilyFormGefProjects
  | IFamilyFormCifProjects

export type TFamilyFormSubmit =
  | IFamilyFormLawsAndPolicies
  | IFamilyFormIntlAgreements
  | TFamilyFormMcfProjects

// Mapping of corpus types to their specific metadata handlers
export const corpusMetadataHandlers: Record<
  string,
  MetadataHandler<TFamilyMetadata>
> = {
  'Intl. agreements': {
    extractMetadata: (formData: TFamilyFormSubmit) => {
      const intlData = formData as IFamilyFormIntlAgreements
      return {
        author: intlData.author ? [intlData.author] : [],
        author_type: intlData.author_type ? [intlData.author_type?.value] : [],
      } as IInternationalAgreementsMetadata
    },
    createSubmissionData: (baseData, metadata) =>
      ({
        ...baseData,
        metadata,
      }) as IInternationalAgreementsFamilyFormPost,
  },
  'Laws and Policies': {
    extractMetadata: (formData: TFamilyFormSubmit) => {
      const lawsPolicyData = formData as IFamilyFormLawsAndPolicies
      return {
        topic: lawsPolicyData.topic?.map((topic) => topic.value) || [],
        hazard: lawsPolicyData.hazard?.map((hazard) => hazard.value) || [],
        sector: lawsPolicyData.sector?.map((sector) => sector.value) || [],
        keyword: lawsPolicyData.keyword?.map((keyword) => keyword.value) || [],
        framework:
          lawsPolicyData.framework?.map((framework) => framework.value) || [],
        instrument:
          lawsPolicyData.instrument?.map((instrument) => instrument.value) ||
          [],
      } as ILawsAndPoliciesMetadata
    },
    createSubmissionData: (baseData, metadata) =>
      ({
        ...baseData,
        metadata,
      }) as ILawsAndPoliciesFamilyFormPost,
  },
  AF: {
    extractMetadata: (formData: TFamilyFormSubmit) => {
      const afData = formData as IFamilyFormAfProjects
      return {
        region: afData.region?.map((region) => region.value) || [],
        sector: afData.sector?.map((sector) => sector.value) || [],
        implementing_agency:
          afData.implementing_agency?.map((agency) => agency.value) || [],
        status: afData.status ? [afData.status?.value] : [],
        project_id: afData.project_id ? [afData.project_id] : [],
        project_url: afData.project_url ? [afData.project_url] : [],
        project_value_co_financing:
          afData.project_value_co_financing !== undefined
            ? [`${afData.project_value_co_financing}`]
            : [],
        project_value_fund_spend:
          afData.project_value_fund_spend !== undefined
            ? [`${afData.project_value_fund_spend}`]
            : [],
      } as IAfProjectsMetadata
    },
    createSubmissionData: (baseData, metadata) =>
      ({
        ...baseData,
        metadata,
      }) as IAfProjectsFamilyFormPost,
  },
  CIF: {
    extractMetadata: (formData: TFamilyFormSubmit) => {
      const cifData = formData as IFamilyFormCifProjects
      return {
        region: cifData.region?.map((region) => region.value) || [],
        sector: cifData.sector?.map((sector) => sector.value) || [],
        implementing_agency:
          cifData.implementing_agency?.map((agency) => agency.value) || [],
        status: cifData.status ? [cifData.status?.value] : [],
        project_id: cifData.project_id ? [cifData.project_id] : [],
        project_url: cifData.project_url ? [cifData.project_url] : [],
        project_value_co_financing:
          cifData.project_value_co_financing !== undefined
            ? [`${cifData.project_value_co_financing}`]
            : [],
        project_value_fund_spend:
          cifData.project_value_fund_spend !== undefined
            ? [`${cifData.project_value_fund_spend}`]
            : [],
      } as ICifProjectsMetadata
    },
    createSubmissionData: (baseData, metadata) =>
      ({
        ...baseData,
        metadata,
      }) as ICifProjectsFamilyFormPost,
  },
  GCF: {
    extractMetadata: (formData: TFamilyFormSubmit) => {
      const gcfData = formData as IFamilyFormGcfProjects
      return {
        region: gcfData.region?.map((region) => region.value) || [],
        sector: gcfData.sector?.map((sector) => sector.value) || [],
        implementing_agency:
          gcfData.implementing_agency?.map((agency) => agency.value) || [],
        status: gcfData.status ? [gcfData.status?.value] : [],
        project_id: gcfData.project_id ? [gcfData.project_id] : [],
        project_url: gcfData.project_url ? [gcfData.project_url] : [],
        project_value_co_financing:
          gcfData.project_value_co_financing !== undefined
            ? [`${gcfData.project_value_co_financing}`]
            : [],
        project_value_fund_spend:
          gcfData.project_value_fund_spend !== undefined
            ? [`${gcfData.project_value_fund_spend}`]
            : [],
        approved_ref: gcfData.approved_ref ? [gcfData.approved_ref] : [],
        result_area:
          gcfData.result_area?.map((result_area) => result_area.value) || [],
        result_type:
          gcfData.result_type?.map((result_type) => result_type.value) || [],
        theme: gcfData.theme?.map((theme) => theme.value) || [],
      } as IGcfProjectsMetadata
    },
    createSubmissionData: (baseData, metadata) =>
      ({
        ...baseData,
        metadata,
      }) as IGcfProjectsFamilyFormPost,
  },
  GEF: {
    extractMetadata: (formData: TFamilyFormSubmit) => {
      const gefData = formData as IFamilyFormGefProjects
      return {
        region: gefData.region?.map((region) => region.value) || [],
        focal_area:
          gefData.focal_area?.map((focal_area) => focal_area.value) || [],
        implementing_agency:
          gefData.implementing_agency?.map((agency) => agency.value) || [],
        status: gefData.status ? [gefData.status?.value] : [],
        project_id: gefData.project_id ? [gefData.project_id] : [],
        project_url: gefData.project_url ? [gefData.project_url] : [],
        project_value_co_financing:
          gefData.project_value_co_financing !== undefined
            ? [`${gefData.project_value_co_financing}`]
            : [],
        project_value_fund_spend:
          gefData.project_value_fund_spend !== undefined
            ? [`${gefData.project_value_fund_spend}`]
            : [],
      } as IGefProjectsMetadata
    },
    createSubmissionData: (baseData, metadata) =>
      ({
        ...baseData,
        metadata,
      }) as IGefProjectsFamilyFormPost,
  },
  Reports: {
    extractMetadata: (formData: TFamilyFormSubmit) => {
      const reportsData = formData as IFamilyFormReports
      return {
        author: reportsData.author ? reportsData.author : [],
        author_type: reportsData.author_type?.map((type) => type.value),
        external_id: reportsData.external_id ? [reportsData.external_id] : [],
      } as IReportsMetadata
    },
    createSubmissionData: (baseData, metadata) =>
      ({
        ...baseData,
        metadata,
      }) as IReportsFamilyFormPost,
  },
  // Add other corpus types here with their specific metadata extraction logic
}

// Utility function to get metadata handler for a specific corpus type
export const getMetadataHandler = (
  corpusType: string,
): MetadataHandler<TFamilyMetadata> => {
  const handler = corpusMetadataHandlers[corpusType]
  if (!handler) {
    throw new Error(`Unsupported corpus type: ${corpusType}`)
  }
  return handler
}
