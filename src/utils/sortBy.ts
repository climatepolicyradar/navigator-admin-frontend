export const sortBy = <T>(key: keyof T, reverse = false) => {
  return (a: T, b: T) => {
    let aValue = a[key]
    let bValue = b[key]

    // Handle arrays (like geographies)
    if (Array.isArray(aValue)) {
      aValue = aValue.join(', ')
    }
    if (Array.isArray(bValue)) {
      bValue = bValue.join(', ')
    }

    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return reverse
        ? bValue.localeCompare(aValue)
        : aValue.localeCompare(bValue)
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return reverse ? +bValue - +aValue : +aValue - +bValue
    }

    return reverse
      ? String(bValue).localeCompare(String(aValue))
      : String(aValue).localeCompare(String(bValue))
  }
}
