import { ICollection, IConfig, IDocument, IEvent } from '@/interfaces'
import {
  ILawsAndPoliciesFamily,
  IInternationalAgreementsFamily,
} from '@/interfaces/Family'

const mockConfig = {
  geographies: [
    {
      node: {
        id: 1,
        display_value: 'World',
        slug: 'world',
        value: 'world',
        type: 'continent',
        parent_id: 0,
      },
      children: [
        {
          node: {
            id: 2,
            display_value: 'Afghanistan',
            slug: 'afghanistan',
            value: 'AFG',
            type: 'ISO-3166',
            parent_id: 1,
          },
          children: [],
        },
      ],
    },
  ],
  languages: {
    en: 'English',
    es: 'Spanish',
  },
  languagesSorted: [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
  ],
  corpora: [
    {
      corpus_import_id: 'CCLW.corpus.i00000001.n0000',
      corpus_type: 'Law and Policies',
    },
  ],
  document: {
    roles: ['Role One', 'Role Two'],
    types: ['Type One', 'Type Two'],
    variants: ['Variant One', 'Variant Two'],
  },
}

const mockUNFCCCFamily: IInternationalAgreementsFamily = {
  import_id: 'UNFCCC.family.1.0',
  title: 'UNFCCC Family One',
  summary: 'Summary for UNFCCC Family One',
  geography: 'Geography One',
  geographies: ['Geography One'],
  category: 'Category One',
  status: 'active',
  slug: 'unfccc-family-one',
  events: ['event1', 'event2'],
  published_date: new Date(2021, 3, 1).toISOString(),
  last_updated_date: new Date(2021, 0, 2).toISOString(),
  documents: ['document1', 'document2'],
  collections: ['collection1', 'collection2'],
  organisation: 'UNFCCC',
  corpus_import_id: 'UNFCCC.corpus.i00000001.n0000',
  corpus_title: 'UNFCCC Submissions',
  corpus_type: 'Intl. agreements',
  created: new Date(2021, 0, 3).toISOString(),
  last_modified: new Date(2021, 0, 4).toISOString(),
  metadata: {
    author: ['Author One'],
    author_type: ['Type One'],
  },
}

const mockCCLWFamily: ILawsAndPoliciesFamily = {
  import_id: 'CCLW.family.2.0',
  title: 'CCLW Family Two',
  summary: 'Summary for CCLW Family Two',
  geography: 'Geography Two',
  geographies: ['Geography Two'],
  category: 'Category Two',
  status: 'active',
  slug: 'cclw-family-two',
  events: ['event3', 'event4'],
  published_date: new Date(2021, 1, 1).toISOString(),
  last_updated_date: new Date(2021, 1, 2).toISOString(),
  documents: ['document3', 'document4'],
  collections: ['collection3', 'collection4'],
  organisation: 'CCLW',
  corpus_import_id: 'CCLW.corpus.i00000001.n0000',
  corpus_title: 'CCLW national policies',
  corpus_type: 'Laws and Policies',
  created: new Date(2021, 1, 3).toISOString(),
  last_modified: new Date(2021, 1, 4).toISOString(),
  metadata: {
    topic: ['Topic One', 'Topic Two'],
    hazard: ['Hazard One', 'Hazard Two'],
    sector: ['Sector One', 'Sector Two'],
    keyword: ['Keyword One', 'Keyword Two'],
    framework: ['Framework One', 'Framework Two'],
    instrument: ['Instrument One', 'Instrument Two'],
  },
}

const mockUNFCCCFamilyNoDocumentsNoEvents: IInternationalAgreementsFamily = {
  ...mockUNFCCCFamily,
  import_id: 'UNFCCC.family.3.0',
  title: 'UNFCCC Family Three',
  summary: 'Summary for UNFCCC Family Three with no documents and no events',
  documents: [], // Without documents
  events: [], // Without events
  created: new Date(2021, 0, 5).toISOString(),
  last_modified: new Date(2021, 0, 6).toISOString(),
  published_date: null,
  last_updated_date: null,
}

const mockCCLWFamilyNoDocuments: ILawsAndPoliciesFamily = {
  ...mockCCLWFamily,
  import_id: 'CCLW.family.4.0',
  title: 'CCLW Family Four',
  summary: 'Summary for CCLW Family Four with no documents',
  documents: [], // Without documents
  created: new Date(2021, 1, 5).toISOString(),
  last_modified: new Date(2021, 1, 5).toISOString(),
}

const mockCCLWFamilyNoEvents: ILawsAndPoliciesFamily = {
  ...mockCCLWFamily,
  import_id: 'CCLW.family.5.0',
  title: 'CCLW Family Five',
  summary: 'Summary for CCLW Family Five with no events',
  events: [], // Without events
  created: new Date(2021, 1, 7).toISOString(),
  last_modified: new Date(2021, 1, 8).toISOString(),
  published_date: null,
  last_updated_date: null,
}

const mockCCLWFamilyWithOneEvent: ILawsAndPoliciesFamily = {
  ...mockCCLWFamilyNoDocuments,
  import_id: 'CCLW.family.6.0',
  title: 'CCLW Family Six',
  summary: 'Summary for CCLW Family Six with one event',
  events: ['event5'],
  created: new Date(2021, 1, 7).toISOString(),
  last_modified: new Date(2021, 1, 8).toISOString(),
}

const mockCCLWFamilyOneDocument: ILawsAndPoliciesFamily = {
  ...mockCCLWFamilyNoDocuments,
  import_id: 'CCLW.family.7.0',
  title: 'CCLW Family Seven',
  summary: 'Summary for CCLW Family Seven with one document',
  documents: ['document5'],
  created: new Date(2021, 1, 5).toISOString(),
  last_modified: new Date(2021, 1, 6).toISOString(),
}

const mockEvent: IEvent = {
  import_id: 'event5',
  event_title: 'Test event title',
  date: new Date(2024, 6, 11).toISOString(),
  event_type_value: 'Event One',
  event_status: 'Submitted',
  family_import_id: 'CCLW.family.6.0',
}

const mockDocument2: IDocument = {
  import_id: 'document5',
  family_import_id: 'CCLW.family.7.0',
  variant_name: null,
  status: 'test',
  slug: 'slug',
  metadata: { role: ['Role One'], type: ['Type One'] },
  physical_id: 1,
  title: 'Test document title',
  md5_sum: null,
  cdn_object: null,
  source_url: null,
  content_type: null,
  user_language_name: null,
  created: new Date(2021, 0, 1).toISOString(),
  last_modified: new Date(2021, 0, 1).toISOString(),
}

const mockDocument = {
  import_id: 'CCLW.doc.1.1',
  family_import_id: 'CCLW.family.2.0',
  variant_name: 'var',
  status: 'status',
  role: 'role',
  type: 'type',
  slug: 'slug',
  physical_id: 'pid',
  title: 'title',
  md5_sum: 'md5',
  cdn_object: 'ob j',
  source_url: 'url',
  content_type: 'cont',
  user_language_name: 'lang',
}

const mockCollection: ICollection = {
  import_id: 'collection1',
  title: 'Test collection',
  description: 'Test description',
  families: [],
  organisation: 'UNFCCC',
}

const mockCCLWConfig: IConfig = {
  ...mockConfig,
  corpora: [
    {
      corpus_import_id: 'CCLW.corpus.i00000001.n0000',
      title: 'CCLW national policies',
      description: 'UNFCCC Submissions',
      corpus_type: 'CCLW national policies',
      corpus_type_description: 'Laws and Policies',
      organisation: {
        name: 'CCLW',
        id: 1,
        display_name: 'CCLW',
        type: 'Academic',
      },
      taxonomy: {
        topic: {
          allow_any: false,
          allow_blanks: false,
          allowed_values: ['Topic One', 'Topic Two'],
        },
        hazard: {
          allow_any: false,
          allow_blanks: false,
          allowed_values: ['Hazard One', 'Hazard Two'],
        },
        sector: {
          allow_any: false,
          allow_blanks: false,
          allowed_values: ['Sector One', 'Sector Two'],
        },
        keyword: {
          allow_any: false,
          allow_blanks: false,
          allowed_values: ['Keyword One', 'Keyword Two'],
        },
        framework: {
          allow_any: false,
          allow_blanks: false,
          allowed_values: ['Framework One', 'Framework Two'],
        },
        instrument: {
          allow_any: false,
          allow_blanks: false,
          allowed_values: ['Instrument One', 'Instrument Two'],
        },
        event_type: {
          allow_any: false,
          allow_blanks: false,
          allowed_values: ['Event One', 'Event Two'],
        },
        _document: {
          role: {
            allow_any: false,
            allow_blanks: false,
            allowed_values: ['Role One', 'Role Two'],
          },
          type: {
            allow_any: false,
            allow_blanks: false,
            allowed_values: ['Type One', 'Type Two'],
          },
        },
        _event: {
          event_type: {
            allow_any: false,
            allow_blanks: false,
            allowed_values: ['Event One', 'Event Two'],
          },
        },
      },
    },
  ],
}

const mockUNFCCCConfig: IConfig = {
  ...mockConfig,
  corpora: [
    {
      corpus_import_id: 'UNFCCC.corpus.i00000001.n0000',
      title: 'UNFCCC Submissions',
      description: 'UNFCCC Submissions',
      corpus_type: 'Intl. agreements',
      corpus_type_description: 'Intl. agreements',
      organisation: {
        name: 'UNFCCC',
        id: 3,
        display_name: 'UNFCCC',
        type: 'UN',
      },
      taxonomy: {
        author: {
          allow_any: false,
          allow_blanks: false,
          allowed_values: ['Author One', 'Author Two'],
        },
        author_type: {
          allow_any: false,
          allow_blanks: false,
          allowed_values: ['Type One', 'Type Two'],
        },
        event_type: {
          allow_any: false,
          allow_blanks: false,
          allowed_values: ['Event One', 'Event Two'],
        },
        _document: {
          role: {
            allow_any: false,
            allow_blanks: false,
            allowed_values: ['Role One', 'Role Two'],
          },
          type: {
            allow_any: false,
            allow_blanks: false,
            allowed_values: ['Type One', 'Type Two'],
          },
        },
        _event: {
          event_type: {
            allow_any: false,
            allow_blanks: false,
            allowed_values: ['Event One', 'Event Two'],
          },
        },
      },
    },
  ],
}

const mockMCFConfig: IConfig = {
  ...mockConfig,
  corpora: [
    {
      corpus_import_id: 'MCF.corpus.i00000001.n0000',
      title: 'Climate Investment Funds Projects',
      description: 'Multilateral Climate Funds',
      corpus_type: 'CIF',
      corpus_type_description: 'Multilateral Climate Funds',
      organisation: {
        name: 'MCF',
        id: 999,
        display_name: 'MCF',
        type: 'MCF',
      },
      taxonomy: {
        region: {
          allow_any: false,
          allow_blanks: false,
          allowed_values: ['Region 1', 'Region 2'],
        },
        sector: {
          allow_any: false,
          allow_blanks: false,
          allowed_values: ['Sector 1', 'Sector 2'],
        },
        status: {
          allow_any: false,
          allow_blanks: false,
          allowed_values: ['Status 1', 'Status 2'],
        },
        _document: {},
        _event: {
          datetime_event_name: {
            allow_any: false,
            allow_blanks: false,
            allowed_values: ['Event 1'],
          },
          event_type: {
            allow_any: false,
            allow_blanks: false,
            allowed_values: ['Event 1'],
          },
        },
        event_type: {
          allow_any: false,
          allow_blanks: false,
          allowed_values: ['Event 1', 'Event 2'],
        },
        project_id: {
          allow_any: true,
          allow_blanks: false,
          allowed_values: ['Project ID 1', 'Project ID 2'],
        },
        project_url: {
          allow_any: true,
          allow_blanks: false,
          allowed_values: ['Project URL', 'Project URL 2'],
        },
        implementing_agency: {
          allow_any: false,
          allow_blanks: false,
          allowed_values: ['Agency 1', 'Agency 2'],
        },
        project_value_fund_spend: {
          allow_any: true,
          allow_blanks: false,
          allowed_values: ['1000', '5000'],
        },
        project_value_co_financing: {
          allow_any: true,
          allow_blanks: false,
          allowed_values: ['1000', '5000'],
        },
      },
    },
    {
      corpus_import_id: 'MCF.corpus.Guidance.n0000',
      title: 'Climate Investment Funds Guidance',
      description: 'Multilateral Climate Funds',
      corpus_type: 'Reports',
      corpus_type_description: 'Multilateral Climate Funds Guidance',
      organisation: {
        name: 'MCF',
        id: 999,
        display_name: 'MCF',
        type: 'MCF',
      },
      taxonomy: {
        author: {
          allow_any: false,
          allow_blanks: false,
          allowed_values: [],
        },
        author_type: {
          allow_any: false,
          allow_blanks: false,
          allowed_values: ['Individual', 'Academic/Research'],
        },
        external_id: {
          allow_any: true,
          allow_blanks: true,
          allowed_values: [],
        },
        event_type: {
          allow_any: false,
          allow_blanks: false,
          allowed_values: ['Event One'],
        },
        _document: {
          type: {
            allow_any: false,
            allow_blanks: false,
            allowed_values: ['Type One', 'Type Two'],
          },
        },
        _event: {
          event_type: {
            allow_any: false,
            allow_blanks: false,
            allowed_values: ['Event One'],
          },
        },
      },
    },
  ],
}

// Exports
export const mockFamiliesData = [
  mockUNFCCCFamily,
  mockCCLWFamily,
  mockUNFCCCFamilyNoDocumentsNoEvents,
  mockCCLWFamilyNoDocuments,
  mockCCLWFamilyNoEvents,
]
export { mockConfig as configMock }
export { mockCCLWConfig as cclwConfigMock }
export { mockUNFCCCConfig as unfcccConfigMock }
export { mockMCFConfig as mcfConfigMock }
export { mockDocument }
export { mockDocument2 }
export { mockEvent }
export { mockCCLWFamilyWithOneEvent }
export { mockCCLWFamilyOneDocument }
export { mockCollection }
