import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { createSection } from '../utils/section-utils'
import { createPage } from '../utils/page-utils'
import { createBlock } from '../utils/block-utils'
import { 
  addItemToArrayAfter,
  removeItemFromArray,
  reorderItemWithinArray,
  addItemToArrayAtIndex } from '../utils/array-utils'

const documentAdapter = createEntityAdapter({
  selectId: (document: any) => document.id
})

const editablesAdapter = createEntityAdapter({
  selectId: (editable: any) => editable.id
})

const initialState: any = documentAdapter.getInitialState({
  title: '',
  sections: {
    ids: ['1', '2', '3'],
    entities: {
      '1': { id: '1', title: 'Section One Section One Section One', pageIds: ['4'] },
      '2': { id: '2', title: 'Section Two', pageIds: ['5'] }, 
      '3': { id: '3', title: 'Section Three', pageIds: ['6'] }
    }
    // openSections?
  },
  pages: {
    ids: ['4', '5', '6'],
    entities: {
      '4': { id: '4', preview: 'Once upon a time there was a lorem ipsum dolor...', sectionId: '1' },
      '5': { id: '5', preview: 'Lorem ipsum dolor...', sectionId: '2' },
      '6': { id: '6', preview: 'Foo bar baz bah...', sectionId: '3' }
    },
    // currentPage?
  },
  blocks: {
    parentIds: [],
    entities: {}
  },
  editables: editablesAdapter.getInitialState()
})

export const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    sectionAdded(state, action) {
      const { after } = action.payload
      const section = createSection()

      state.sections.entities[section.id] = section

      state.sections.ids = addItemToArrayAfter(
        section.id,
        state.sections.ids,
        after
      )
    },
    sectionsReordered(state, action) {
      const { sourceIndex, destinationIndex } = action.payload

      state.sections.ids = reorderItemWithinArray(
        sourceIndex,
        destinationIndex,
        state.sections.ids
      )
    },
    pageAdded(state, action) {
      const { sectionId, after } = action.payload
      const page = createPage(sectionId)

      state.pages.entities[page.id] = page
      state.pages.ids.push(page.id)

      state.sections.entities[sectionId].pageIds = addItemToArrayAfter(
        page.id,
        state.sections.entities[sectionId].pageIds,
        after
      )
    },
    pagesReordered(state, action) {
      const { pageId, source, destination } = action.payload
      const sourceId = source.droppableId
      const destinationId = destination.droppableId
      const sourceIndex = source.index
      const destinationIndex = destination.index

      // If dragging within a section
      if (sourceId === destinationId) {
        state.sections.entities[sourceId].pageIds = reorderItemWithinArray(
          sourceIndex,
          destinationIndex,
          state.sections.entities[sourceId].pageIds
        )
      } else {
        // If dragging between sections

        // Remove page from source section's pageIds array
        state.sections.entities[sourceId].pageIds = removeItemFromArray(
          pageId,
          state.sections.entities[sourceId].pageIds
        )

        // Add page to destination section's pageIds array
        state.sections.entities[destinationId].pageIds = addItemToArrayAtIndex(
          pageId,
          state.sections.entities[destinationId].pageIds,
          destinationIndex,
        )
      }
    },
    blockAdded(state, action) {
      const { type, parentId, after } = action.payload
      const block = createBlock(type, parentId)
      const blockId = block.id

      // Note: consider creating new paragraph's phrase child here

      state.blocks.entities[blockId] = block

      if (parentId) {
        state.blocks.entities[parentId].childIds = addItemToArrayAfter(
          blockId,
          state.blocks.entities[parentId].childIds,
          after
        )
      } else {
        state.blocks.parentIds = addItemToArrayAfter(
          blockId,
          state.blocks.parentIds,
          after
        )
      }
    },
    blockRemoved(state, action) {
      const { blockId, parentId } = action.payload

      delete state.blocks.entities[blockId]
      
      // If removing a child block
      if (parentId) {
        state.blocks.entities[parentId].childIds = removeItemFromArray(
          blockId, 
          state.blocks.entities[parentId].childIds
        )
      } else {
        // If removing a parent block
        state.blocks.parentIds = removeItemFromArray(
          blockId, 
          state.blocks.parentIds
        )
      }
    },
    blocksReordered(state, action) {
      const { blockId, parentId, source, destination } = action.payload
      const sourceIndex = source.index
      const destinationIndex = destination.index

      // If reordering a parent block
      if (!parentId) {
        state.blocks.parentIds = reorderItemWithinArray(
          sourceIndex,
          destinationIndex,
          state.blocks.parentIds
        )
      } else {
        // If reordering a child block
        const sourceId = source.droppableId
        const destinationId = destination.droppableId

        // If dragging within same parent
        if (sourceId === destinationId) {
          state.blocks.entities[sourceId].childIds = reorderItemWithinArray(
            sourceIndex,
            destinationIndex,
            state.blocks.entities[sourceId].childIds
          )
        } else {
          // If dragging between parents

          // Remove block from parent childIds array
          state.blocks.entities[sourceId].childIds = removeItemFromArray(
            blockId,
            state.blocks.entities[sourceId].childIds
          )

          // Add block to destination childIds array
          state.blocks.entities[destinationId].childIds = addItemToArrayAtIndex(
            blockId,
            state.blocks.entities[destinationId].childIds,
            destinationIndex,
          )
        }
      }
    },
    editableAdded(state, action) {
      editablesAdapter.addOne(state.editables, action.payload)
    },
    editableUpdated(state, action) {
      editablesAdapter.updateOne(state.editables, action.payload)
    }
  }
})

export const editablesSelectors = editablesAdapter.getSelectors(
  (state: any) => state.editables
)

export const {
  sectionAdded,
  sectionsReordered,
  pageAdded,
  pagesReordered,
  blockAdded,
  blockRemoved,
  blocksReordered,
  editableAdded,
  editableUpdated
} = documentSlice.actions

export default documentSlice.reducer
