import React from 'react'

import dynamic from 'next/dynamic'

import { Page } from './Page'

const Draggable = dynamic(
  async () => {
    const mod = await import('react-beautiful-dnd')
    return mod.Draggable
  },
  { ssr: false },
)

interface IPagesInnerList {
  pageIds: Array<string>,
  pageEntities: any
}

export class PagesInnerList extends React.PureComponent<IPagesInnerList> {
  render() {
    return (
      this.props.pageIds.map((pageId: string, index: number) => (
        <Draggable
          key={pageId}
          draggableId={pageId}
          index={index}
        >
          {(provided, snapshot) => (
            <Page 
              provided={provided}
              snapshot={snapshot}
              page={this.props.pageEntities[pageId]}
            />
          )}
        </Draggable>
      ))
    )
  }
}
