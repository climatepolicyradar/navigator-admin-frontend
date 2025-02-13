const ALLOWED_TAGS = [
  'a',
  'b',
  'em',
  'i',
  'ins',
  'li',
  'ol',
  'p',
  'strong',
  'u',
  'ul',
]

const REPLACE: Record<string, string> = {
  b: 'strong',
  i: 'em',
  u: 'ins',
}

export const stripHtml = (html: string) => {
  return html
    .replace(/<\/*(\w+)[^>]*>?/gim, (match, tag: string) => {
      const lowerCasedTag = tag.toLowerCase()

      if (!ALLOWED_TAGS.includes(lowerCasedTag)) return ''

      const updatedMatch =
        lowerCasedTag in REPLACE
          ? match.replace(/(<\/*)\w+/im, `$1${REPLACE[lowerCasedTag]}`)
          : match

      return updatedMatch.replace(/\s+\bstyle="[^"]*?"/im, '')
    })
    .replace(/&[^;]+;/g, '')
    .trim()
}
