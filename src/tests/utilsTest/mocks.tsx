import { ICCLWFamily, IUNFCCCFamily } from '@/interfaces/Family'

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
      children: [],
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
  taxonomies: {
    CCLW: {
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
    },
    UNFCCC: {
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
    },
  },
  document: {
    roles: ['Role One', 'Role Two'],
    types: ['Type One', 'Type Two'],
    variants: ['Variant One', 'Variant Two'],
  },
  event: {
    types: ['Event Type One', 'Event Type Two'],
  },
}

const mockUNFCCCFamily: IUNFCCCFamily = {
  import_id: 'UNFCCC.family.1.0',
  title: 'UNFCCC Family One',
  summary: 'Summary for UNFCCC Family One',
  geography: 'Geography One',
  category: 'Category One',
  status: 'active',
  slug: 'unfccc-family-one',
  events: ['event1', 'event2'],
  published_date: '1/1/2021',
  last_updated_date: '2/1/2021',
  documents: ['document1', 'document2'],
  collections: ['collection1', 'collection2'],
  organisation: 'UNFCCC',
  corpus_id: 'UNFCCC.corpus.i00000001.n0000',
  corpus_title: 'UNFCCC Submissions',
  corpus_type: 'Intl. agreements',
  created: '3/1/2021',
  last_modified: '4/1/2021',
  metadata: {
    author: ['Author One'],
    author_type: ['Type One'],
  },
}

const mockCCLWFamily: ICCLWFamily = {
  import_id: 'CCLW.family.2.0',
  title: 'CCLW Family Two',
  summary: 'Summary for CCLW Family Two',
  geography: 'Geography Two',
  category: 'Category Two',
  status: 'active',
  slug: 'cclw-family-two',
  events: ['event3', 'event4'],
  published_date: '1/2/2021',
  last_updated_date: '2/2/2021',
  documents: ['document3', 'document4'],
  collections: ['collection3', 'collection4'],
  organisation: 'CCLW',
  corpus_id: 'CCLW.corpus.i00000001.n0000',
  corpus_title: 'CCLW national policies',
  corpus_type: 'Laws and Policies',
  created: '3/2/2021',
  last_modified: '4/2/2021',
  metadata: {
    topic: ['Topic One', 'Topic Two'],
    hazard: ['Hazard One', 'Hazard Two'],
    sector: ['Sector One', 'Sector Two'],
    keyword: ['Keyword One', 'Keyword Two'],
    framework: ['Framework One', 'Framework Two'],
    instrument: ['Instrument One', 'Instrument Two'],
  },
}

const mockUNFCCCFamilyNoDocumentsNoEvents: IUNFCCCFamily = {
  ...mockUNFCCCFamily,
  import_id: 'UNFCCC.family.3.0',
  title: 'UNFCCC Family Three',
  summary: 'Summary for UNFCCC Family Three with no documents and no events',
  documents: [], // Sin documentos
  events: [], // Sin eventos
  created: '5/1/2021',
  last_modified: '6/1/2021',
}

const mockCCLWFamilyNoDocuments: ICCLWFamily = {
  ...mockCCLWFamily,
  import_id: 'CCLW.family.4.0',
  title: 'CCLW Family Four',
  summary: 'Summary for CCLW Family Four with no documents',
  documents: [], // Sin documentos
  created: '5/2/2021',
  last_modified: '6/2/2021',
}

const mockCCLWFamilyNoEvents: ICCLWFamily = {
  ...mockCCLWFamily,
  import_id: 'CCLW.family.5.0',
  title: 'CCLW Family Five',
  summary: 'Summary for CCLW Family Five with no events',
  events: [], // Sin eventos
  created: '7/2/2021',
  last_modified: '8/2/2021',
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

// Exports
export const mockFamiliesData = [
  mockUNFCCCFamily,
  mockCCLWFamily,
  mockUNFCCCFamilyNoDocumentsNoEvents,
  mockCCLWFamilyNoDocuments,
  mockCCLWFamilyNoEvents,
]
export { mockConfig as configMock }
export { mockDocument }
