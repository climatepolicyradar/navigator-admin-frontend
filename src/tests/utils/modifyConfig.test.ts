import { IConfig } from '@/interfaces'
import { modifyConfig } from '@utils/modifyConfig'

describe('modifyConfig', () => {
  it('should add a languagesSorted property to the config object with languages sorted alphabetically by label', () => {
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
      corpora: [], // TODO
      taxonomies: {
        CCLW: {
          topic: { allow_blanks: false, allowed_values: ['topic1', 'topic2'] },
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
          }, // TODO
        },
        UNFCCC: {
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
          }, // TODO
        },
      },
      event: {
        types: ['type1', 'type2'],
      },
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

  it('should handle empty languages object', () => {
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
      taxonomies: {
        CCLW: {
          topic: { allow_blanks: false, allowed_values: [] },
          hazard: { allow_blanks: false, allowed_values: [] },
          sector: { allow_blanks: false, allowed_values: [] },
          keyword: { allow_blanks: false, allowed_values: [] },
          framework: { allow_blanks: false, allowed_values: [] },
          instrument: { allow_blanks: false, allowed_values: [] },
          event_type: { allow_blanks: false, allowed_values: [] },
        },
        UNFCCC: {
          author: { allow_blanks: false, allowed_values: [] },
          author_type: { allow_blanks: false, allowed_values: [] },
          event_type: { allow_blanks: false, allowed_values: [] },
        },
      },
      event: {
        types: [],
      },
    }

    const modifiedConfig = modifyConfig(mockConfig)
    expect(modifiedConfig).toHaveProperty('languagesSorted')
    expect(modifiedConfig.languagesSorted).toEqual([])
  })
})
