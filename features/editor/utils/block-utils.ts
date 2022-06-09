import { v4 as uuidv4 } from 'uuid'

export function createBlock(type: string, parentId: number|null = null) {
  return {
    id: uuidv4(),
    type,
    parentId,
    childIds: []
  }
}
