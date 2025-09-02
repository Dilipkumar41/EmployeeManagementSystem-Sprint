import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'

const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV, // enable Redux DevTools in dev
  // default middleware is fine; we'll customize later if needed
})

export default store
