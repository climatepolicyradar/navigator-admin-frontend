import { modifyConfig } from '@utils/modifyConfig'

import { IConfig } from '@/interfaces'

describe('modifyConfig', () => {
  it('adds a languagesSorted property to the config object with languages sorted alphabetically by label', () => {
    const mockConfig: IConfig = {
      document: {
        roles: ['role1', 'role2'],
        types: ['type1', 'type2'],
        variants: ['variant1', 'variant2'],
      },
      languages: {
        en: 'English',
        es: 'Spanish',
      },
      geographies: [
        {
          node: {
            id: 1,
            display_value: 'MockNode',
            slug: 'mock-node',
            value: 'mockNode',
            type: 'mockType',
            parent_id: 0,
          },
          children: [],
        },
      ],
      languagesSorted: [],
      corpora: [
        {
          corpus_import_id: 'CCLW.corpus.i00000001.n0000',
          title: 'CCLW national policies',
          description: 'CCLW national policies',
          corpus_type: 'Laws and Policies',
          corpus_type_description: 'Laws and policies',
          organisation: {
            name: 'CCLW',
            id: 1,
            display_name: 'CCLW',
            type: 'Academic',
          },
          taxonomy: {
            topic: {
              allow_blanks: false,
              allowed_values: ['topic1', 'topic2'],
            },
            hazard: {
              allow_blanks: false,
              allowed_values: ['hazard1', 'hazard2'],
            },
            sector: {
              allow_blanks: false,
              allowed_values: ['sector1', 'sector2'],
            },
            keyword: {
              allow_blanks: false,
              allowed_values: ['keyword1', 'keyword2'],
            },
            framework: {
              allow_blanks: false,
              allowed_values: ['framework1', 'framework2'],
            },
            instrument: {
              allow_blanks: false,
              allowed_values: ['instrument1', 'instrument2'],
            },
            event_type: {
              allow_blanks: false,
              allowed_values: ['eventType1', 'eventType2'],
            },
            _document: {
              role: {
                allow_blanks: false,
                allowed_values: ['role1', 'role2'],
              },
              type: {
                allow_blanks: false,
                allowed_values: ['type1', 'type2'],
              },
            },
            _event: {
              event_type: {
                allow_blanks: false,
                allowed_values: ['eventType1', 'eventType2'],
              },
              datetime_event_name: {
                allow_blanks: false,
                allowed_values: ['eventType1'],
              },
            },
          },
        },
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
              allow_blanks: false,
              allowed_values: ['author1', 'author2'],
            },
            author_type: {
              allow_blanks: false,
              allowed_values: ['authorType1', 'authorType2'],
            },
            event_type: {
              allow_blanks: false,
              allowed_values: ['eventType1', 'eventType2'],
            },
            _document: {
              role: {
                allow_blanks: false,
                allowed_values: ['role1', 'role2'],
              },
              type: {
                allow_blanks: false,
                allowed_values: ['type1', 'type2'],
              },
            },
            _event: {
              event_type: {
                allow_blanks: false,
                allowed_values: ['eventType1', 'eventType2'],
              },
              datetime_event_name: {
                allow_blanks: false,
                allowed_values: ['eventType1'],
              },
            },
          },
        },
      ],
    }

    const expectedLanguagesSorted = [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' },
    ]

    const modifiedConfig = modifyConfig(mockConfig)
    expect(modifiedConfig).toHaveProperty('languagesSorted')
    expect(modifiedConfig.languagesSorted).toEqual(
      expect.arrayContaining(expectedLanguagesSorted),
    )
  })

  it(' handles empty languages object', () => {
    const mockConfig: IConfig = {
      document: {
        roles: ['role1', 'role2'],
        types: ['type1', 'type2'],
        variants: ['variant1', 'variant2'],
      },
      languages: {},
      geographies: [],
      languagesSorted: [],
      corpora: [],
    }

    const modifiedConfig = modifyConfig(mockConfig)
    expect(modifiedConfig).toHaveProperty('languagesSorted')
    expect(modifiedConfig.languagesSorted).toEqual([])
  })
})
