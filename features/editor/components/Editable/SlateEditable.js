import { useState } from 'react'

import { withHistory } from 'slate-history'
import { withReact, Slate, Editable } from 'slate-react'
import { createEditor } from 'slate'
import { useDispatch } from 'react-redux'
import { useDebouncedCallback } from 'use-debounce' // replace with mantine version

import { useEditorConfig } from '../../hooks/useEditorConfig'
import { editableUpdated } from '../../stores/document-slice'

function getPlacholder(type) {
  switch(type) {
    case 'heading':
      return 'Heading'
    case 'phrase':
      return 'Phrase'
    case 'free-translation':
      return 'Free translation'
    default:
      return ''
  }
}

export function SlateEditable(props) {
  const { block } = props
  const [editor,] = useState(withHistory(withReact(createEditor())))
  const [value, setValue] = useState(props.value)
  const dispatch = useDispatch()

  const {
    renderElement,
    renderLeaf,
    onKeyDown
  } = useEditorConfig(editor)

  const updateEditableStore = useDebouncedCallback(
    newValue => {
      dispatch(
        editableUpdated({
          id: block.id,
          changes: {
            value: newValue
          }
        })
      )
    },
    500
  )

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={newValue => {
        setValue(newValue)
        updateEditableStore(newValue)
      }}
    >
      <Editable 
        className={`block-editable`}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={keyDownEvent => onKeyDown(editor, keyDownEvent)}
        placeholder={getPlacholder(block.type)}
        autoFocus={true}
        spellCheck={false}
        // onClick={() => setBlockFocused(true)}
        // onBlur={() => setBlockFocused(false)}
      />
    </Slate>
  )
}
