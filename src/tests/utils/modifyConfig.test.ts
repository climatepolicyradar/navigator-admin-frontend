import { IConfig } from '@/interfaces'
import { cclwConfigMock, unfcccConfigMock } from '@/tests/utilsTest/mocks'
import { modifyConfig } from '@utils/modifyConfig'
import each from 'jest-each'

describe('modifyConfig', () => {
  each([unfcccConfigMock, cclwConfigMock]).it(
    'should add a languagesSorted property to the config object with languages sorted alphabetically by label',
    (configObject: IConfig) => {
      const expectedLanguagesSorted = [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
      ]

      const modifiedConfig = modifyConfig(configObject)
      expect(modifiedConfig).toHaveProperty('languagesSorted')
      expect(modifiedConfig.languagesSorted).toEqual(
        expect.arrayContaining(expectedLanguagesSorted),
      )
    },
  )

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
      event: {
        types: [],
      },
    }

    const modifiedConfig = modifyConfig(mockConfig)
    expect(modifiedConfig).toHaveProperty('languagesSorted')
    expect(modifiedConfig.languagesSorted).toEqual([])
  })
})
