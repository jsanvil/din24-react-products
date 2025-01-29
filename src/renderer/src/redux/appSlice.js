import { createSlice } from '@reduxjs/toolkit'

const appSlice = createSlice({
  name: 'app',
  initialState: {
    title: 'Electron React Products',
    loading: {
      status: false,
      text: 'Cargando...',
      loadingMore: false
    }
  },
  reducers: {
    setTitle(state, action) {
      state.title = action.payload
    },
    setLoading(state, action) {
      state.loading.status = action.payload.status
      state.loading.text = action.payload.text
    },
    setLoadingMore(state, action) {
      state.loading.loadingMore = action.payload
    }
  }
})

export const { setTitle, setLoading, setLoadingMore } = appSlice.actions
export default appSlice.reducer
