import { useEffect } from 'react'

import { useDispatch } from 'react-redux'
import { Droppable } from 'react-beautiful-dnd'

import { blockAdded } from '../../../stores/document-slice'
import { Blocks } from '../Blocks'

export function Paragraph(props) {
  const { block, entities } = props
  const dispatch = useDispatch()

  // Ensure paragraph contains at least one phrase
  useEffect(() => {
    if (block.childIds.length === 0) {
      dispatch(
        blockAdded({
          type: 'phrase',
          parentId: block.id,
          after: null
        })
      )
    }
  }, [block, dispatch])
  
  return (
    <>
      <Droppable
        droppableId={block.id}
        type={'paragraph'}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {block.childIds.length 
              ? <Blocks 
                  ids={block.childIds}
                  entities={entities}
                />
              : null
            }
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </>
  )
}
