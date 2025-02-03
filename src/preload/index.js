import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getProducts: async (from, size, filters) => {
    try {
      return await ipcRenderer.invoke('get-products', from, size, filters)
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  addProduct: async (product) => {
    return await ipcRenderer.invoke('add-product', product).catch((error) => {
      console.error(error)
      throw error
    })
  },
  updateProduct: async (product) => {
    return await ipcRenderer.invoke('update-product', product).catch((error) => {
      console.error(error)
      throw error
    })
  },
  deleteProduct: async (product) => {
    return await ipcRenderer.invoke('delete-product', product).catch((error) => {
      console.error(error)
      throw error
    })
  },
  chooseImageFile: async () => {
    return await ipcRenderer.invoke('choose-image-file').catch((error) => {
      console.error(error)
      throw error
    })
  },
  getImage: async (imagePath) => {
    return await ipcRenderer.invoke('read-image-file', imagePath).catch((error) => {
      console.error(error)
      throw error
    })
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
