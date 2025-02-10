/* eslint-disable no-unused-vars */
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import i18nextBackend from 'i18next-electron-fs-backend'
import Filters from '../shared/models/Filters'

// Custom APIs for renderer
const api = {
  /**
   * Get all products from the main process repository
   * @param {Filters} filters
   * @returns Promise<Product[]>
   */
  getProducts: async (filters) => {
    try {
      return await ipcRenderer.invoke('get-products', filters)
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  /**
   * Add a new product to the main process repository
   * @param {Product} product
   * @returns Promise<Product>
   * @throws Error
   */
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
  },
  onUpdateTheme: (theme) => ipcRenderer.on('update-theme', theme),
  onChangeLanguage: (language) => ipcRenderer.on('change-language', language),
  i18nextElectronBackend: i18nextBackend.preloadBindings(ipcRenderer, process)
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
