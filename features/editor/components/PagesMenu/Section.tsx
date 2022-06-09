import { useCallback } from 'react'

import dynamic from 'next/dynamic'
import { useDispatch } from 'react-redux'
import { Accordion, Menu } from '@mantine/core'

import { pageAdded } from '../../stores/document-slice'
import { PagesInnerList } from './PagesInnerList'

import styles from './PagesMenu.module.css'

const Droppable = dynamic(
  async () => {
    const mod = await import('react-beautiful-dnd')
    return mod.Droppable
  },
  { ssr: false },
)

function SectionLabel(props: any) {
  const { title } = props

  return (
    <div onClick={e => { e.preventDefault(); e.stopPropagation(); console.log('editing section title...') }}>{title}</div>
  )
}

export function Section(props: any) {
  const { provided, snapshot, section, pageEntities } = props
  const dispatch = useDispatch()

  const addPage = useCallback(() => {
    dispatch(
      pageAdded({
        sectionId: section.id
      })
    )
  }, [dispatch])

  return (
    <div
      className={styles.section}
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div className={styles.dragHandle} {...provided.dragHandleProps}></div>
      <Accordion
        iconPosition={'right'}
        offsetIcon={false}
        className={styles.accordion}
        classNames={{
          label: styles.label,
          item: styles.item,
          control: styles.control,
          icon: styles.icon,
          contentInner: styles.contentInner
        }}
      >
        <Accordion.Item label={section.title}>
          <Droppable
            droppableId={section.id}
            type={'page'}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <PagesInnerList
                  pageIds={section.pageIds}
                  pageEntities={pageEntities}
                />
                {provided.placeholder}
                <button onClick={() => addPage()} style={{ textDecoration: 'underline' }}>Add Page</button>
              </div>
            )}
          </Droppable>
        </Accordion.Item>
      </Accordion>
      <Menu className={styles.menu}>
        <Menu.Label>Section</Menu.Label>
        <Menu.Item>Settings</Menu.Item>
        <Menu.Item color={'red'}>Delete</Menu.Item>
      </Menu>
    </div>
  )
}
