import isHotkey from 'is-hotkey'
import { Range, Transforms } from 'slate'

import { Glossed } from '../components/Glossed'
import { nodeExistsAtLocation, toggleMark } from '../utils/editable-utils'
import { focusGlossInput, toggleGlossedNodeAtLocation } from '../utils/glossed-utils'

/**
 * Sets basic editor configurations/overrides and returns callbacks for props of the 
 * Editable component.
 */
export function useEditorConfig(editor) {
  setInlineElements(editor)

  return {
    renderElement,
    renderLeaf,
    onKeyDown
  }
}

/**
 * Sets glossed elements to inline.
 */
function setInlineElements(editor) {
  const { isInline } = editor

  editor.isInline = element => (
    ['glossed'].includes(element.type) ? true : isInline(element)
  )
}

/**
 * Renders the correct slate element to the editable by element's custom 'type' attribute.
 */
function renderElement(props) {
  switch (props.element.type) {
    case 'heading':
      return <h1 {...props.attributes} className={'font-semibold text-xl'}>{props.children}</h1>
    case 'phrase':
      return <span {...props.attributes}>{props.children}</span>
    case 'glossed':
      return <Glossed {...props} />
    default:
      return <span {...props.attributes} style={{ color: 'red' }}>{props.children}</span>
  }
}

/**
 * Renders the correct slate leaf to the editable based on leaf's custom attributes.
 */
function renderLeaf(props) {
  let el = <>{props.children}</>

  if (props.leaf.bold) {
    el = <strong>{el}</strong>
  }

  if (props.leaf.italic) {
    el = <em>{el}</em>
  }

  return <span {...props.attributes}>{el}</span>
}

/**
 * Maps custom editable hotkey actions to their respective handlers.
 */
function onKeyDown(editor, keyDownEvent) {
  const rangeIsCollapsed = Range.isCollapsed(editor.selection)

  // Move caret by 'offset' on arrow left or right
  if (isHotkey('ArrowLeft', keyDownEvent) && rangeIsCollapsed) {
    keyDownEvent.preventDefault()

    Transforms.move(editor, { unit: 'offset', reverse: true })
  }
  else if (isHotkey('ArrowRight', keyDownEvent) && rangeIsCollapsed) {
    keyDownEvent.preventDefault()
    
    Transforms.move(editor, { unit: 'offset' })
  }

  // Move caret into gloss input
  else if (isHotkey('ArrowDown', keyDownEvent) && rangeIsCollapsed) {
    if (nodeExistsAtLocation(editor, editor.selection, 'glossed')) {
      keyDownEvent.preventDefault()

      focusGlossInput(editor)
    }
  }

  // Toggle glossed
  else if (isHotkey('mod+g', keyDownEvent)) {
    keyDownEvent.preventDefault()

    toggleGlossedNodeAtLocation(editor, editor.selection)
  }

  // Toggle bold mark
  else if (isHotkey('mod+b', keyDownEvent)) {
    keyDownEvent.preventDefault()

    toggleMark(editor, 'bold')
  }
}
