import { useState } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Button, Textarea, Text, Card, CardBody } from '@chakra-ui/react'

export const Draft = () => {
  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createEmpty(),
  )

  const setEditorStateFromHtml = (html: string) => {
    const contentBlock = htmlToDraft(html)
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks,
    )
    setEditorState(EditorState.createWithContent(contentState))
  }

  return (
    <div>
      <Card>
        <CardBody>
          <Button mb="4" onClick={() => setEditorStateFromHtml(DUMY_HTML)}>
            Load dummy html
          </Button>
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={setEditorState}
            toolbar={{
              options: ['inline', 'list', 'link'],
              link: {
                inDropdown: true,
                className: undefined,
                component: undefined,
                popupClassName: undefined,
                dropdownClassName: undefined,
                showOpenOptionOnHover: true,
                defaultTargetOption: '_self',
                options: ['link', 'unlink'],
                linkCallback: undefined,
              },
            }}
          />
        </CardBody>
      </Card>
      <Text my="4">
        This is the HTML output from <code>draftToHtml()</code>
      </Text>
      <Textarea
        disabled
        height={'300px'}
        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
      />
    </div>
  )
}

const DUMY_HTML = `<p>Hey this <strong>editor</strong> rocks 😀</p><p>another paragraph <a href="/" target="_blank">LINK</a> of content</p><ul><li>item 1</li><li>item 2</li></ul>`
