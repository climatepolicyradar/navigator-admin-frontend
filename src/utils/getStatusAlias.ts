export const getStatusAlias = (status?: string | null) => {
  if (!status) return ''
  switch (status.toLowerCase()) {
    case 'deleted':
      return 'NO DOCUMENTS'
    default:
      return status
  }
}
