import { ICCLWFamily, IUNFCCCFamily } from "@/interfaces/Family";

const useConfigMock = jest.fn(() => ({
  config: {
    document: {
      roles: ['role1', 'role2'],
      types: ['type1', 'type2'],
      variants: ['variant1', 'variant2'],
    },
    languages: {
      en: 'English',
      es: 'Spanish',
    },
    languagesSorted: [
      {
        value: 'English',
        label: 'English',
      },
      {
        value: 'Spanish',
        label: 'Spanish',
      },
    ],
  },
  loading: false,
  error: null,
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
    author_type: ['Type One']
  }
};

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
    instrument: ['Instrument One', 'Instrument Two']
  }
};

// Exports
export const mockFamiliesData = [mockUNFCCCFamily, mockCCLWFamily];
export { useConfigMock };