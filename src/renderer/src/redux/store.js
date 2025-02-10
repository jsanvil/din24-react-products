import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './productsSlice'
import appReducer from './appSlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    products: productsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
  devTools: process.env.NODE_ENV !== 'production'
})
