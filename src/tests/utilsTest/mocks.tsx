import { ICCLWFamily, IUNFCCCFamily } from '@/interfaces/Family'

const useConfigMock = jest.fn(() => ({
  config: {
    geographies: [{
      node: {
        id: 1,
        display_value: "World",
        slug: "world",
        value: "world",
        type: "continent",
        parent_id: 0
      },
      children: []
    }],
    languages: {
      en: "English",
      es: "Spanish"
    },
    languagesSorted: [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' }
    ],
    taxonomies: {
      CCLW: {
        topic: { allow_any: false, allow_blanks: false, allowed_values: ["Topic One", "Topic Two"] },
        hazard: { allow_any: false, allow_blanks: false, allowed_values: ["Hazard One", "Hazard Two"] },
        sector: { allow_any: false, allow_blanks: false, allowed_values: ["Sector One", "Sector Two"] },
        keyword: { allow_any: false, allow_blanks: false, allowed_values: ["Keyword One", "Keyword Two"] },
        framework: { allow_any: false, allow_blanks: false, allowed_values: ["Framework One", "Framework Two"] },
        instrument: { allow_any: false, allow_blanks: false, allowed_values: ["Instrument One", "Instrument Two"] },
      },
      UNFCCC: {
        author: { allow_any: false, allow_blanks: false, allowed_values: ["Author One", "Author Two"] },
        author_type: { allow_any: false, allow_blanks: false, allowed_values: ["Type One", "Type Two"] },
      }
    },
    document: {
      roles: ["Role One", "Role Two"],
      types: ["Type One", "Type Two"],
      variants: ["Variant One", "Variant Two"]
    },
    event: {
      types: ["Event Type One", "Event Type Two"]
    }
  },
  loading: false,
  error: null
}))

const mockUNFCCCFamily: IUNFCCCFamily = {
  import_id: '1',
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
  created: '3/1/2021',
  last_modified: '4/1/2021',
  metadata: {
    author: ['Author One'],
    author_type: ['Type One'],
  },
}

const mockCCLWFamily: ICCLWFamily = {
  import_id: '2',
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

// Exports
export const mockFamiliesData = [mockUNFCCCFamily, mockCCLWFamily]
export { useConfigMock }
