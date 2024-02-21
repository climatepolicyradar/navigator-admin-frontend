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

export { useConfigMock }
