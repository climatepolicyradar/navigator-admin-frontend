import { useState } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Button, Textarea, Card } from '@chakra-ui/react'

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
      <Button onClick={() => setEditorStateFromHtml(DUMY_HTML)}>
        Load dummy html
      </Button>
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={setEditorState}
      />
      <Textarea
        disabled
        height={'300px'}
        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
      />
    </div>
  )
}

const DUMY_HTML = `<p>Hey this <strong>editor</strong> rocks 😀</p><p>another paragraph of content</p><ul><li>item 1</li><li>item 2</li></ul>`
