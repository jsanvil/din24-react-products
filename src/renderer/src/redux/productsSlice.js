import { createSlice } from '@reduxjs/toolkit'
import Product from '../models/Product'

const initialState = {
  list: []
}

const productsSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts(state, action) {
      state.list = action.payload
    },
    clearProducts(state) {
      state.list = []
    },
    addProduct(state, action) {
      state.list.push(action.payload)
    },
    updateProduct(state, action) {
      const product = new Product(action.payload)
      const index = state.list.findIndex((p) => p.id === product.id)
      state.list[index] = product
    },
    deleteProduct(state, action) {
      state.list = state.list.filter((product) => product.id !== action.payload.id)
    }
  }
})

export const { setProducts, clearProducts, addProduct, updateProduct, deleteProduct } =
  productsSlice.actions
export default productsSlice.reducer
