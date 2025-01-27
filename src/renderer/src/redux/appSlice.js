import { createSlice } from '@reduxjs/toolkit'

const appSlice = createSlice({
  name: 'app',
  initialState: {
    title: 'Electron React Products'
  },
  reducers: {
    setTitle(state, action) {
      console.log('redux Title:', state.title)
      state.title = action.payload
    }
  }
})

export const { setTitle } = appSlice.actions
export default appSlice.reducer
