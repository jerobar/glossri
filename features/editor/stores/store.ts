import { configureStore } from '@reduxjs/toolkit'

import documentReducer from './document-slice'

const store = configureStore({
  reducer: {
    document: documentReducer
  }
})

export default store
