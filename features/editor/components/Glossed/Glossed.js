import { useCallback, useState, useRef, useEffect } from 'react'

import { useSlateStatic, ReactEditor, useSelected } from 'slate-react'
import { Transforms } from 'slate'
import isHotkey from 'is-hotkey'

import { InlineChromiumBugFix } from './InlineChromiumBugFix'

/**
 * Prevents default drop events on inputs.
 */
function onDropCapture(dropEvent) {
  dropEvent.preventDefault()
  dropEvent.stopPropagation()
}

export function Glossed(props) {
  const { element } = props
  const editor = useSlateStatic()
  const currentNodePath = useCallback(() => (
    ReactEditor.findPath(editor, element)
  ), [editor, element])
  const selected = useSelected()
  const [gloss, setGloss] = useState(props.element.gloss)
  const [glossWidth, setGlossWidth] = useState(1)
  const glossSpanRef = useRef(null)
  const glossInputRef = useRef(null)

  // Trying to access selected when focus is on the input results 
  // in a "cannot resolve slate node" error...
  // useEffect(() => {
  //   console.log('selected:', selected)
  // }, [selected])

  // Calculate width of gloss input
  useEffect(() => {
    setGlossWidth(
      glossSpanRef.current.offsetWidth 
      ? glossSpanRef.current.offsetWidth 
      : 1
    )
  }, [gloss])

  // Focus gloss input on creation
  useEffect(() => {
    if (props.element.gloss === '') {
      // Run ony after Firefox (automatically) runs its own onBlur event
      setTimeout(() => glossInputRef.current.focus(), 0)
    }
  }, [props.element.gloss])

  // Update the parent node with current value of gloss
  const applyChangesToNode = useCallback(gloss => {
    setGloss(gloss)

    Transforms.setNodes(
      editor,
      { gloss },
      { at: currentNodePath() }
    )
  }, [editor, currentNodePath])

  // Position the caret outside of this node (after)
  const focusCurrentNode = useCallback(position => {
    Transforms.select(editor, currentNodePath())
    Transforms.collapse(editor, { edge: 'end' })
    if (position === 'outside') Transforms.move(editor, { unit: 'offset' })
    ReactEditor.focus(editor)
  }, [editor, currentNodePath])

  // Handle keydown events in the gloss input
  const onGlossInputKeyDown = useCallback(keyDownEvent => {
    if (isHotkey('ArrowUp', keyDownEvent)) {
      keyDownEvent.preventDefault()

      // Return caret to word
      focusCurrentNode('inside')
    } else if (isHotkey('enter', keyDownEvent)) {
      keyDownEvent.preventDefault()

      // Return caret to just outside word
      focusCurrentNode('outside')
    }
  }, [focusCurrentNode])

  // Apply gloss changes on input blur
  const onGlossInputBlur = useCallback(blurEvent => {
    applyChangesToNode(gloss)
  }, [applyChangesToNode, gloss])

  return (
    <span
      className={`glossed${selected ? ' selected' : ''}`}
      {...props.attributes}
      draggable={true}
      style={{ minWidth: glossWidth }}
    >
      <InlineChromiumBugFix />
      {props.children}
      <InlineChromiumBugFix />
      <span
        className={'gloss-container'}
        contentEditable={false}
      >
        <span
          className={'gloss'}
          ref={glossSpanRef}
          contentEditable={false}
        >
          {gloss ? gloss : ' '}
        </span>
        <input
          className={'gloss-input'}
          ref={glossInputRef}
          type={'text'}
          value={gloss}
          contentEditable={false}
          onChange={changeEvent => setGloss(changeEvent.target.value)}
          onKeyDown={keyDownEvent => onGlossInputKeyDown(keyDownEvent)}
          onBlur={blurEvent => onGlossInputBlur(blurEvent)}
          onDropCapture={dropEvent => onDropCapture(dropEvent)}
          style={{ width: glossWidth }}
        />
      </span>
    </span>
  )
}
