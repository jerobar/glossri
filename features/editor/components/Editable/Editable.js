import { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { editablesSelectors } from '../../stores/document-slice'
import { editableAdded } from '../../stores/document-slice'
import { SlateEditable } from './SlateEditable'

export function Editable(props) {
  const { block } = props
  const editable = useSelector(state => editablesSelectors.selectById(state.document, block.id))
  const dispatch = useDispatch()

  // Create editable entity for block if one doesn't exist
  useEffect(() => {
    if (!editable) {
      dispatch(
        editableAdded({
          id: block.id,
          value: [{
            type: block.type,
            children: [{ text: '' }]
          }]
        })
      )
    }
  }, [editable, dispatch, block])

  return (
    <>
      {editable && 
        <SlateEditable
          block={block}
          value={editable.value}
        />
      }
    </>
  )
}
