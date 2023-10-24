export const generateOptions = (values?: string[]) => {
  return values?.map((value) => ({ value, label: value })) || []
}

export const generateLanguageOptions = (collection: {
  [key: string]: string
}) => {
  const options = Object.keys(collection).map((key) => {
    return { value: key, label: collection[key] || key }
  })
  return options
}
