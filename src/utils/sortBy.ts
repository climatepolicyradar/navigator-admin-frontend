export function sortBy<T>(key: keyof T, reverse = false) {
  return (a: T, b: T) => {
    if (a[key] < b[key]) return reverse ? 1 : -1
    if (a[key] > b[key]) return reverse ? -1 : 1
    return 0
  }
}
