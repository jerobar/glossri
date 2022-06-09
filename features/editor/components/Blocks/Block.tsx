import { useCallback } from 'react'

import { useDispatch } from 'react-redux'
import { Menu } from '@mantine/core'

import { Heading } from './Heading'
import { Paragraph } from './Paragraph'
import { Phrase } from './Phrase'
import { blockRemoved } from '../../stores/document-slice'
import { AppendBlock } from './AppendBlock'

interface IBlockProps {
  block: any,
  entities: any,
  provided: any,
  snapshot: any
}

function renderBlockType(block: any, entities: any) {
  switch(block.type) {
    case 'heading':
      return <Heading block={block} />
    case 'paragraph':
      return <Paragraph block={block} entities={entities} />
    case 'phrase':
      return <Phrase block={block} />
    default:
      console.error(`No block of type '${block.type}' found.`)
      return null
  }
}

export function Block(props: IBlockProps) {
  const { block, entities, provided } = props
  const blockTypeCapitalCase = block.type[0].toUpperCase() + block.type.slice(1).toLowerCase()
  const dispatch = useDispatch()

  const deleteBlock = useCallback(() => {
    dispatch(
      blockRemoved({
        blockId: block.id,
        parentId: block.parentId
      })
    )
  }, [dispatch])

  return (
    <section 
      className={`block ${block.type}-block`}
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div className={'block-content-container'}>
        <div className={'block-drag-handle drag-handle'} {...provided.dragHandleProps}></div>
        <div className={'block-content'}>
          {renderBlockType(block, entities)}
        </div>
        <div className={'block-menu'}>
          <Menu>
            <Menu.Label>
              {blockTypeCapitalCase}
            </Menu.Label>
            <Menu.Item>
              Settings
            </Menu.Item>
            <Menu.Item onClick={() => deleteBlock()} color={'red'}>
              Delete {blockTypeCapitalCase}
            </Menu.Item>
          </Menu>
        </div>
      </div>
      <div className={'append-block-menu-container'}>
        <AppendBlock block={block} />
      </div>
    </section>
  )
}
