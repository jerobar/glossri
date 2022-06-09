import React from 'react'

import { Draggable } from 'react-beautiful-dnd'

import { Block } from './Block'

interface IBlocksProps {
  ids: any,
  entities: any
}

export class Blocks extends React.PureComponent<IBlocksProps> {
  render() {
    return (
      this.props.ids.map((id: string, index: number) => (
        <Draggable
          key={id}
          draggableId={id}
          index={index}
        >
          {(provided, snapshot) => (
            <Block
              block={this.props.entities[id]}
              entities={this.props.entities}
              provided={provided}
              snapshot={snapshot}
            />
          )}
        </Draggable>
      ))
    )
  }
}
