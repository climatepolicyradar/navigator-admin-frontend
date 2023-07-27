export const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString()
}

export const formatDateISO = (date: string) => {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}
