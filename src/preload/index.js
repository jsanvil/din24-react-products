import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getProducts: async (from, size) => {
    return await ipcRenderer.invoke('get-products', from, size)
  },
  addProduct: async (product) => {
    return await ipcRenderer.invoke('add-product', product)
  },
  updateProduct: async (product) => {
    return await ipcRenderer.invoke('update-product', product)
  },
  deleteProduct: async (product) => {
    return await ipcRenderer.invoke('delete-product', product)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
