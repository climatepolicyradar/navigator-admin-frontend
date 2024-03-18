import { IConfig } from '@/interfaces'

export const modifyConfig = (config: IConfig): IConfig => {
  // Add languagesSorted to config object
  const languagesSorted = Object.keys(config?.languages || {})
    .map((key) => ({
      value: key,
      label: config?.languages[key],
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
  return { ...config, languagesSorted: languagesSorted }
}
