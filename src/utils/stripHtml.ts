const ALLOWED_TAGS = [
  'a',
  'b',
  'em',
  'i',
  'ins',
  'li',
  'ol',
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
      if (!ALLOWED_TAGS.includes(tag)) return ''
      if (!(tag in REPLACE)) return match

      const newTag = REPLACE[tag]
      return match.replace(/(<\/*)\w+/im, `$1${newTag}`)
    })
    .replace(/&[^;]+;/g, '')
    .trim()
}
