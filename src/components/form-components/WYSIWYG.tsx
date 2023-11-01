import { useEffect, useState } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Card, CardBody } from '@chakra-ui/react'

type TProps = {
  html?: string
  onChange: (html: string) => void
}

const DEFAULT_HTML = '<p></p>'

export const WYSIWYG = ({ html = DEFAULT_HTML, onChange }: TProps) => {
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

  const editorStateHTML = draftToHtml(
    convertToRaw(editorState.getCurrentContent()),
  )

  useEffect(() => {
    setEditorStateFromHtml(html)
  }, [html])

  useEffect(() => {
    onChange(editorStateHTML)
  }, [editorStateHTML, onChange])

  return (
    <div>
      <Card>
        <CardBody>
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={setEditorState}
            toolbar={{
              options: ['inline', 'list'],
            }}
          />
        </CardBody>
      </Card>
    </div>
  )
}
