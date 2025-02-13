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
      if (!(lowerCasedTag in REPLACE)) return match

      const newTag = REPLACE[lowerCasedTag]
      return match.replace(/(<\/*)\w+/im, `$1${newTag}`)
    })
    .replace(/&[^;]+;/g, '')
    .trim()
}
