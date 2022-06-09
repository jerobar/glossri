import { Editor, Element } from 'slate'

/**
 * Returns node entries of the specified type at the provided location.
 */
export function getNodeEntriesAtLocation(editor, location, type) {
  return Editor.nodes(editor, {
    at: location,
    match: n => Element.isElement(n) && n.type === type
  })
}

/**
 * Returns whether the specified node type exists at the provided location.
 */
export function nodeExistsAtLocation(editor, location, type) {
  const [node] = getNodeEntriesAtLocation(editor, location, type)

  return !!node
}

/**
 * Returns previous node entry of the specified type at the provided location.
 */
export function getPreviousNodeEntriesAtLocation(editor, location, type) {
  return Editor.previous(editor, {
    at: location,
    match: n => Element.isElement(n) && n.type === type
  })
}

/**
 * Returns a set of the active marks at the current selection.
 */
export function getActiveMarks(editor) {
  return new Set(Object.keys(Editor.marks(editor) ?? {}))
}

/**
 * Toggles the specified mark at the current selection.
 */
export function toggleMark(editor, mark) {
  const activeMarks = getActiveMarks(editor)

  if (activeMarks.has(mark)) {
    Editor.removeMark(editor, mark)
  } else {
    Editor.addMark(editor, mark, true)
  }
}
