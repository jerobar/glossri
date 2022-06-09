import React from 'react'

import dynamic from 'next/dynamic'

import { Section } from './Section'

const Draggable = dynamic(
  async () => {
    const mod = await import('react-beautiful-dnd')
    return mod.Draggable
  },
  { ssr: false },
)

interface ISectionsInnerListProps {
  sectionIds: Array<string>,
  sectionEntities: any,
  pageEntities: any
}

export class SectionsInnerList extends React.PureComponent<ISectionsInnerListProps> {
  render() {
    return (
      this.props.sectionIds.map((sectionId: string, index: number) => (
        <Draggable
          key={sectionId}
          draggableId={sectionId}
          index={index}
        >
          {(provided, snapshot) => (
            <Section 
              provided={provided}
              snapshot={snapshot}
              section={this.props.sectionEntities[sectionId]}
              pageEntities={this.props.pageEntities}
            />
          )}
        </Draggable>
      ))
    )
  }
}
