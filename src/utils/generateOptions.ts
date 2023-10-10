export const generateOptions = (values?: string[]) => {
  return values?.map((value) => ({ value, label: value })) || []
}
