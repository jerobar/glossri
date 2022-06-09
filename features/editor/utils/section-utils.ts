import { v4 as uuidv4 } from 'uuid'

export function createSection() {
  return {
    id: uuidv4(),
    title: 'Untitled Section',
    pageIds: []
  }
}
