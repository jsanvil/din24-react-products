import { createSlice } from '@reduxjs/toolkit'
import Product from '../../../shared/models/Product'

const initialState = {
  list: [],
  filters: {
    search: '',
    sort: {
      field: '',
      order: 'asc'
    },
    priceRange: {
      min: 0,
      max: 1000
    },
    minStock: 0,
    date: {
      min: '',
      max: ''
    }
  }
}

const productsSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    filterSearch(state, action) {
      state.filters.search = action.payload || ''
    },
    sortByField(state, action) {
      state.filters.sort = action.payload
    },
    filterPriceRange(state, action) {
      const [min, max] = action.payload
      state.filters.priceRange.min = min
      state.filters.priceRange.max = max
    },
    filterDateRange(state, action) {
      if (action.payload) state.filters.date.min = action.payload.min
      if (action.payload) state.filters.date.max = action.payload.max
    },
    filterMinStock(state, action) {
      state.filters.minStock = action.payload
    },
    resetFilters(state) {
      state.filters = initialState.filters
    },
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
      console.log('status updateProduct', action.payload)
      const product = new Product(action.payload)
      state.list = state.list.map((p) => (p.id === product.id ? product : p))
    },
    deleteProduct(state, action) {
      state.list = state.list.filter((product) => product.id !== action.payload.id)
    }
  }
})

export const {
  setProducts,
  addProducts,
  clearProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  filterPriceRange,
  filterDateRange,
  filterMinStock,
  filterSearch,
  sortByField
} = productsSlice.actions
export default productsSlice.reducer
