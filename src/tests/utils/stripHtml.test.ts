import { stripHtmlForRichText } from '@/utils/stripHtml'

const expectNoStrip = (html: string) =>
  expect(stripHtmlForRichText(html)).toBe(html)

describe('stripHtmlForRichText', () => {
  it('strips most html tags', () => {
    expect(stripHtmlForRichText('<img src="image.jpg />')).toBe('')
    expect(stripHtmlForRichText('line<br>break')).toBe('linebreak')
    expect(stripHtmlForRichText('<div>Other elements</div>')).toBe(
      'Other elements',
    )
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
    expect(stripHtmlForRichText('<b>bold</b>')).toBe('<strong>bold</strong>')
    expect(stripHtmlForRichText('<i>italic</i>')).toBe('<em>italic</em>')
    expect(stripHtmlForRichText('<U>underline</U>')).toBe(
      '<ins>underline</ins>',
    )
  })

  it('removes style attributes from allowed tags', () => {
    expect(stripHtmlForRichText('<p style="color:red;">red</p>')).toBe(
      '<p>red</p>',
    )
    expect(
      stripHtmlForRichText(
        '<p\n      style="font-weight:bold" id="bold">bold</p>',
      ),
    ).toBe('<p id="bold">bold</p>')
  })
})
