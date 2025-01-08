export const formatDate = (date: string | null) => {
  if (date === null) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString()
}

export const formatDateTime = (date: string) => {
  const d = new Date(date)
  return d.toLocaleString()
}

export const formatDateISO = (
  date: string | Date | null | undefined,
): string => {
  if (!date) return ''

  const d = date instanceof Date ? date : new Date(String(date))

  // Check if the date is valid
  if (isNaN(d.getTime())) {
    console.warn(`Invalid date: ${String(date)}`)
    return ''
  }

  return d.toISOString().split('T')[0]
}
