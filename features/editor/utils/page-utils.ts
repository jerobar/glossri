import { v4 as uuidv4 } from 'uuid'

export function createPage(sectionId: number) {
  return {
    id: uuidv4(),
    preview: 'Page preview here...',
    sectionId
  }
}
