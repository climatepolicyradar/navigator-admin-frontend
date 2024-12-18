import { IFamilyFormBase } from '@/components/forms/FamilyForm'
import {
  IAFProjectsFamilyFormPost,
  IAFProjectsMetadata,
  IFamilyFormPostBase,
  IGefProjectsFamilyFormPost,
  IGefProjectsMetadata,
  IInternationalAgreementsMetadata,
  ILawsAndPoliciesMetadata,
  TFamilyFormPost,
  TFamilyMetadata,
} from '../../../interfaces/Family'
import {
  IInternationalAgreementsFamilyFormPost,
  ILawsAndPoliciesFamilyFormPost,
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
  // Intl. agreements
  author?: string
  author_type?: IChakraSelect
}

interface IFamilyFormLawsAndPolicies extends IFamilyFormBase {
  // Laws and Policies
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

interface IFamilyFormAFProjects extends IFamilyFormMcfProjects {
  sector?: IChakraSelect[]
}

interface IFamilyFormGefProjects extends IFamilyFormMcfProjects {
  focal_area?: IChakraSelect[]
}

type TFamilyFormMcfProjects = IFamilyFormAFProjects | IFamilyFormGefProjects

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
      const afData = formData as IFamilyFormAFProjects
      return {
        region: afData.region?.map((region) => region.value) || [],
        sector: afData.sector?.map((sector) => sector.value) || [],
        implementing_agency:
          afData.implementing_agency?.map((agency) => agency.value) || [],
        status: afData.status ? [afData.status?.value] : [],
        project_id: afData.project_id ? [afData.project_id] : [],
        project_url: afData.project_url ? [afData.project_url] : [],
        project_value_co_financing: afData.project_value_co_financing
          ? [afData.project_value_co_financing]
          : [0],
        project_value_fund_spend: afData.project_value_fund_spend
          ? [afData.project_value_fund_spend]
          : [0],
      } as IAFProjectsMetadata
    },
    createSubmissionData: (baseData, metadata) =>
      ({
        ...baseData,
        metadata,
      }) as IAFProjectsFamilyFormPost,
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
        project_value_co_financing: gefData.project_value_co_financing
          ? [gefData.project_value_co_financing]
          : [0],
        project_value_fund_spend: gefData.project_value_fund_spend
          ? [gefData.project_value_fund_spend]
          : [0],
      } as IGefProjectsMetadata
    },
    createSubmissionData: (baseData, metadata) =>
      ({
        ...baseData,
        metadata,
      }) as IGefProjectsFamilyFormPost,
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
