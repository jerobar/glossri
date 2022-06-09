import { useCallback } from 'react'

import dynamic from 'next/dynamic'
import { useSelector, useDispatch } from 'react-redux'
import { Navbar, ScrollArea } from '@mantine/core'

import { pagesReordered, sectionsReordered, sectionAdded } from '../../stores/document-slice'
import { SectionsInnerList } from './SectionsInnerList'

const DragDropContext = dynamic(
  async () => {
    const mod = await import('react-beautiful-dnd')
    return mod.DragDropContext
  },
  { ssr: false },
)

const Droppable = dynamic(
  async () => {
    const mod = await import('react-beautiful-dnd')
    return mod.Droppable
  },
  { ssr: false },
)

export function PagesMenu() {
  const sections = useSelector((state: any) => state.document.sections)
  const { ids: sectionIds, entities: sectionEntities } = sections
  const pages = useSelector((state: any) => state.document.pages)
  const { entities: pageEntities } = pages
  const dispatch = useDispatch()

  const onDragEnd = useCallback((result: any) => {
      const { source, type, destination, draggableId } = result
  
      // If dropped outside Droppable or not dropped into a new position
      if (
        !destination || 
        (destination.droppableId === source.droppableId &&
        destination.index === source.index)
      ) {
        return
      }
  
      // If dragging (page) into a section
      if (type == 'page') {
        dispatch(
          pagesReordered({
            pageId: draggableId,
            source,
            destination
          })
        )
      } else {
        dispatch(
          sectionsReordered({
            sourceIndex: source.index,
            destinationIndex: destination.index
          })
        )
      }
    }
  , [dispatch])

  const addSection = useCallback(() => {
    dispatch(
      sectionAdded({ after: null })
    )
  }, [dispatch])

  return (
    <>
      <Navbar.Section>{/* Nabar header */}</Navbar.Section>
        <Navbar.Section grow component={ScrollArea}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId={'sections'}
              type={'section'}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <SectionsInnerList 
                    sectionIds={sectionIds}
                    sectionEntities={sectionEntities}
                    pageEntities={pageEntities}
                  />
                  {provided.placeholder}
                  <button onClick={() => addSection()} style={{ textDecoration: 'underline' }}>Add Section</button>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Navbar.Section>
      <Navbar.Section>{/* Nabar footer */}</Navbar.Section>
    </>
  )
}
