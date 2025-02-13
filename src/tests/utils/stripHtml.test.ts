import { stripHtml } from '@/utils/stripHtml'

const expectNoStrip = (html: string) => expect(stripHtml(html)).toBe(html)

describe('stripHtml', () => {
  it('strips most html tags', () => {
    expect(stripHtml('<img src="image.jpg />')).toBe('')
    expect(stripHtml('line<br>break')).toBe('linebreak')
    expect(stripHtml('<div>Other elements</div>')).toBe('Other elements')
  })

  it('does not strip allowed html tags', () => {
    expectNoStrip('<p>Paragraph of text</p>')
    expectNoStrip('<strong>strong</strong>')
    expectNoStrip('<EM>EMPHASIS</EM>')
    expectNoStrip('<ul><li>unordered</li><li>list</li></ul')
    expectNoStrip('<ol><li>unordered</li><li>list</li></ol')
    expectNoStrip('<a href="https://climatepolicyradar.org">CPR</a>')
  })

  it('casts legacy typographic html tags to ones our WYSIWYG supports', () => {
    expect(stripHtml('<b>bold</b>')).toBe('<strong>bold</strong>')
    expect(stripHtml('<i>italic</i>')).toBe('<em>italic</em>')
    expect(stripHtml('<U>underline</U>')).toBe('<ins>underline</ins>')
  })

  it('removes style attributes from allowed tags', () => {
    expect(stripHtml('<p style="color:red;">red</p>')).toBe('<p>red</p>')
    expect(
      stripHtml('<p\n      style="font-weight:bold" id="bold">bold</p>'),
    ).toBe('<p id="bold">bold</p>')
  })
})
