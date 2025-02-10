import { createSlice } from '@reduxjs/toolkit'

const appSlice = createSlice({
  name: 'app',
  initialState: {
    title: 'mainView.title',
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
    },
    hideLoading(state) {
      state.loading.status = false
      state.loading.loadingMore = false
    }
  }
})

export const { setTitle, setLoading, setLoadingMore, hideLoading } = appSlice.actions
export default appSlice.reducer
