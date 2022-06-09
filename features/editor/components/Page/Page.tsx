import { useCallback } from 'react'

import { resetServerContext, DragDropContext, Droppable } from 'react-beautiful-dnd'
import { GetServerSideProps } from 'next'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Paper, Pagination } from '@mantine/core'

import { blocksReordered, blockAdded } from '../../stores/document-slice'
import { Blocks } from '../Blocks'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  resetServerContext()

  return {props: { data : []}}
}

export function Page() {
  const { parentIds, entities }  = useSelector((state: any) => state.document.blocks)
  const dispatch = useDispatch()

  const onDragEnd = useCallback((result: any) => {
    const { source, type, destination, draggableId } = result
    let parentId = null

    // If dropped outside Droppable or not dropped into a new position
    if (
      !destination || 
      (destination.droppableId === source.droppableId &&
      destination.index === source.index)
    ) {
      return
    }
    
    // If dragging (phrase) into a paragraph
    if (type === 'paragraph') parentId = source.droppableId

    dispatch(
      blocksReordered({
        blockId: draggableId,
        parentId,
        source,
        destination
      })
    )
  }, [dispatch])

  const appendBlock = useCallback((type: any) => {
    dispatch(
      blockAdded({
        type
      })
    )
  }, [dispatch])

  return (
    <Container>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId={'page'}
          type={'block'}
        >
          {(provided, snapshot) => (
            <>
              <Paper 
                ref={provided.innerRef}
                {...provided.droppableProps}
                p={'md'} 
                shadow={'xs'}
              >
                <div style={{ color: '#aaa', display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Section Foo - Page 2 ?</span> <span>Edit/Preview ?</span>
                </div>
                {parentIds.length 
                  ? <Blocks ids={parentIds} entities={entities} /> 
                  : <div>
                      + <button style={{ textDecoration: 'underline' }} onClick={() => appendBlock('heading')}>
                          Heading
                        </button> |&nbsp;
                        <button style={{ textDecoration: 'underline' }} onClick={() => appendBlock('paragraph')}>
                          Paragraph
                        </button>
                    </div>
                }
                {provided.placeholder}
              </Paper>
              <Pagination page={19} total={20} />
              + New Page After button?
            </>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  )
}
