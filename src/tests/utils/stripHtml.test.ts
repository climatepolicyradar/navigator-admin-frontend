import { stripHtml } from '@/utils/stripHtml'

const expectNoStrip = (html: string) => expect(stripHtml(html)).toBe(html)

describe('stripHtml', () => {
  it('strips most html tags', () => {
    expect(stripHtml('<img src="image.jpg />')).toBe('')
    expect(stripHtml('line<br>break')).toBe('linebreak')
    expect(stripHtml('<p>Paragraph of text</p>')).toBe('Paragraph of text')
    expect(stripHtml('<div>Other elements</div>')).toBe('Other elements')
  })

  it('does not strip allowed html tags', () => {
    expectNoStrip('<strong>strong</strong>')
    expectNoStrip('<em>emphasis</em>')
    expectNoStrip('<ul><li>unordered</li><li>list</li></ul')
    expectNoStrip('<ol><li>unordered</li><li>list</li></ol')
    expectNoStrip('<a href="https://climatepolicyradar.org">CPR</a>')
  })

  it('casts legacy typographic html tags to ones our WYSIWYG supports', () => {
    expect(stripHtml('<b>bold</b>')).toBe('<strong>bold</strong>')
    expect(stripHtml('<i>italic</i>')).toBe('<em>italic</em>')
    expect(stripHtml('<u>underline</u>')).toBe('<ins>underline</ins>')
  })
})
