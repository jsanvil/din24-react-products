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
    addProducts(state, action) {
      const products = action.payload
      // compare the products in the payload with the products in the state
      products.forEach((product) => {
        state.list.find((p) => p.id === product.id) || state.list.push(product)
      })
    },
    clearProducts(state) {
      state.list = []
    },
    addProduct(state, action) {
      const product = new Product(action.payload)
      state.list.find((p) => p.id === product.id) || state.list.push(product)
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

export const { setProducts, addProducts, clearProducts, addProduct, updateProduct, deleteProduct } =
  productsSlice.actions
export default productsSlice.reducer
