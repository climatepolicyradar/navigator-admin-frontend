import {
  IFamilyFormIntlAgreements,
  IFamilyFormLawsAndPolicies,
  TFamilyFormSubmit,
} from '@/components/forms/FamilyForm'
import {
  IFamilyFormPostBase,
  IInternationalAgreementsMetadata,
  ILawsAndPoliciesMetadata,
  TFamilyFormPost,
  TFamilyMetadata,
} from '../../../interfaces/Family'
import {
  IInternationalAgreementsFamilyFormPost,
  ILawsAndPoliciesFamilyFormPost,
} from '../../../interfaces/Family'

// Type-safe metadata handler type
export type MetadataHandler<T extends TFamilyMetadata> = {
  extractMetadata: (formData: TFamilyFormSubmit) => T
  createSubmissionData: (
    baseData: IFamilyFormPostBase,
    metadata: T,
  ) => TFamilyFormPost
}

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
