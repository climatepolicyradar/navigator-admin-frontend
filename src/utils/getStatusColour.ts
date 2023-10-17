export const getStatusColour = (status?: string | null) => {
  if (!status) return 'grey'
  switch (status.toLowerCase()) {
    case 'published':
      return 'green'
    case 'deleted':
      return 'red'
    default:
      return 'grey'
  }
}
