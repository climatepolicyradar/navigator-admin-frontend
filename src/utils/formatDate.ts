export const formatDate = (date: string | null) => {
  if (date === null) {
    return 'N/A'
  }
  const d = new Date(date)
  return d.toLocaleDateString()
}

export const formatDateTime = (date: string) => {
  const d = new Date(date)
  return d.toLocaleString()
}

export const formatDateISO = (date: string) => {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}
