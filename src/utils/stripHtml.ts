export const stripHtml = (html: string) => {
  return html
    .replace(/<[^>]*>?/gm, '')
    .replace(/&[^;]+;/g, '')
    .trim()
}
