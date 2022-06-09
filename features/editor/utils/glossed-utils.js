import { Editor, Transforms, Range, Element } from 'slate'
import { ReactEditor } from 'slate-react'

import { nodeExistsAtLocation } from './editable-utils'

/**
 * Returns a computed range around a given word if current range is collapsed.
 */
 export function getWordRangeAtLocation(editor, location) {
  const { path, offset } = location.anchor
  const [nodeStartEdge, nodeEndEdge] = Editor.edges(
    editor, 
    path
  )
  let nodeStartOffset = nodeStartEdge.offset
  let nodeEndOffset = nodeEndEdge.offset
  let wordStartOffset = 0
  let wordEndOffset = 0
  const unicodeLetterRegex = /\p{L}/u

  // Find offset of start of word
  if (offset !== nodeStartOffset) {
    for (let i = offset; i > nodeStartOffset; i--) {
      const currentCharacter = Editor.string(editor, {
        anchor: { path, offset: i - 1 },
        focus: { path, offset: i }
      })

      if (!unicodeLetterRegex.test(currentCharacter)) {
        wordStartOffset = i
        break
      }
    }
  }

  // Find offset of end of word
  for (let i = offset; i <= nodeEndOffset; i++) {
    const currentCharacter = Editor.string(editor, {
      anchor: { path, offset: i + 1 },
      focus: { path, offset: i }
    })

    if (
      (i === nodeEndOffset) || 
      (!unicodeLetterRegex.test(currentCharacter))
    ) {
      wordEndOffset = i
      break
    }
  }

  // Return range that wraps word
  return {
    anchor: { path, offset: wordStartOffset },
    focus: { path, offset: wordEndOffset }
  }
}

/**
 * Wraps specified range in a glossed node.
 */
 export function wrapRangeInGlossedNode(editor, range) {
  if (!nodeExistsAtLocation(editor, range, 'phrase-delimeter')) {
    const glossedElement = {
      type: 'glossed',
      // word: Editor.string(editor, range),
      gloss: '',
      children: [{ text: '' }]
    }

    Transforms.wrapNodes(editor, 
      glossedElement, 
      { at: range, split: true }
    )
  }
}

/**
 * Unwraps existing glossed node at provided location.
 */
export function unwrapGlossedNodeAtLocation(editor, location) {
  Transforms.unwrapNodes(editor, {
    at: location,
    match: n => Element.isElement(n) && n.type === 'glossed',
    voids: true
  })
}

/**
 * Toggles glossed node at the specified location.
 */
export function toggleGlossedNodeAtLocation(editor, location) {
  // If location does not intersect an existing glossed node
  if (!nodeExistsAtLocation(editor, location, 'glossed')) {
    // If location does not intersect a phrase-delimeter node
    if (!nodeExistsAtLocation(editor, location, 'phrase-delimeter')) {
      let wordRange = location

      if (Range.isCollapsed(location)) {
        wordRange = getWordRangeAtLocation(editor, location)
        Transforms.select(editor, wordRange)
        Transforms.collapse(editor, { edge: 'end' })
      }

      wrapRangeInGlossedNode(editor, wordRange)
      Transforms.collapse(editor, { edge: 'end' })
    }
  }
  // If location intersects an existing glossed node
  else {
    unwrapGlossedNodeAtLocation(editor, location)
  }
}

/**
 * Removes glossed node at the specified location.
 */
export function removeGlossedNodeAtLocation(editor, location) {
  Transforms.removeNodes(editor, {
    at: location,
    match: n => Element.isElement(n) && n.type === 'glossed'
  })
}

/**
 * Moves caret into glossed node's gloss input.
 */
export function focusGlossInput(editor) {
  const domRange = ReactEditor.toDOMRange(editor, editor.selection)
  const parentElement = domRange.commonAncestorContainer.parentElement
  const glossedElement = parentElement.closest('.glossed')
  const glossInput = glossedElement.querySelector('.gloss-input')

  glossInput.focus()
}
