import { useCallback } from 'react'

import { useDispatch } from 'react-redux'

import { blockAdded } from '../../stores/document-slice'

export function AppendBlock(props) {
  const { block } = props
  const dispatch = useDispatch()

  const appendBlock = useCallback(type => {
    dispatch(
      blockAdded({
        type,
        parentId: block.parentId,
        after: block.id
      })
    )
  }, [dispatch, block])

  if (!block.parentId) {
    return (
      <div>
        + <button style={{ textDecoration: 'underline' }} onClick={() => appendBlock('heading')}>Heading</button> |&nbsp;
          <button style={{ textDecoration: 'underline' }} onClick={() => appendBlock('paragraph')}>Paragraph</button>
      </div>
    )
  } else {
    return (
      <div>
        + <button style={{ textDecoration: 'underline' }} onClick={() => appendBlock('phrase')}>Phrase</button>
      </div>
    )
  }
}
