import { app, shell, BrowserWindow, ipcMain, dialog, nativeTheme } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import fs from 'fs'

import { setMainMenu } from './menu'
import icon from '../../resources/icon.png?asset'
import ImageUtil from './utils/ImageUtil'
import {
  installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from 'electron-devtools-installer'

// import SimpleJsonStorage from './utils/SimpleJsonStorage'

import BaseProductRepository from './repository/BaseProductRepository'

import i18nextBackend from 'i18next-electron-fs-backend'
import i18n from './i18next.main.config'
import AppSettingsStorage from './utils/AppSettingsStorage'

// i18n.on('loaded', (loaded) => {
//   i18n.changeLanguage(loaded.language)
//   i18n.off('loaded')
// })

i18n.on('languageChanged', (lng) => {
  console.log('Language changed to', lng)
  const window = BrowserWindow.getFocusedWindow()
  setMainMenu(window, settingsStorage, i18n)
  window.webContents.send('change-language', lng)
})

function installExtensions(win) {
  if (process.env.NODE_ENV === 'development') {
    // Open the DevTools.
    win.webContents.openDevTools()
    // Install extensions
    installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
      .then(([redux, react]) => console.log(`Added Extensions:  ${redux.name}, ${react.name}`))
      .catch((err) => console.log('An error occurred: ', err))
  }
}

// const ENV_MODE = import.meta.env.mode

let productRepository

/**
 * Almacenamiento de la configuración de la aplicación (SimpleJsonStorage)
 */
// const settingsStorage = new SimpleJsonStorage(join(app.getPath('userData'), 'settings.json'))
const settingsStorage = new AppSettingsStorage(join(app.getPath('userData'), 'settings.json'))

async function initStorage() {
  const ENV_MODE = import.meta.env.MAIN_VITE_ENV
  if (ENV_MODE === 'dev') {
    console.log('Using local storage')
    const LocalProductRepository = (await import('./repository/LocalProductRepository')).default
    productRepository = new LocalProductRepository(app)
    await productRepository.load()
  } else {
    console.log('Using API storage')
    const ApiProductRepository = (await import('./repository/ApiProductRepository')).default
    productRepository = new ApiProductRepository(app)
  }

  // check if products extends BaseProductRepository
  if (!(productRepository instanceof BaseProductRepository)) {
    throw new Error('Invalid product repository')
  }
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    setTimeout(() => {
      mainWindow.webContents.send('change-language', i18n.language)
    }, 500)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.webContents.on('did-finish-load', async () => {
    await loadSettings(settingsStorage, mainWindow)
    mainWindow.show() // Mostrar la ventana con el contenido ya cargado y el tema aplicado
    // Esto se hace para evitar el parpadeo de la ventana al cambiar el tema en la carga
    // Si no lo hiciéramos, la ventana se mostraría con el tema por defecto y luego cambiaría
  })

  installExtensions(mainWindow)

  i18nextBackend.mainBindings(ipcMain, mainWindow, fs)
  setMainMenu(mainWindow, settingsStorage, i18n)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  initStorage().then(() => {
    console.log('Storage initialized')
    createWindow()
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    app.quit()
  } else {
    i18nextBackend.clearMainBindings(ipcMain)
  }
})

/**
 * Cargar la configuración de la aplicación desde el almacenamiento
 *
 * @param {SimpleJsonStorage} settingsStorage - Instancia de SimpleJsonStorage
 */
async function loadSettings(settingsStorage, window) {
  const settings = await settingsStorage.load()
  // const settings = await settingsStorage.read({ theme: nativeTheme.themeSource })
  if (settings.theme) {
    nativeTheme.themeSource = settings.theme
    // Enviar el evento a la ventana para actualizar el tema
    window.webContents.send('update-theme', settings.theme)
  }
  if (settings.language) {
    i18n.changeLanguage(settings.language)
  }
}

ipcMain.handle('delete-product', async (event, product) => {
  const window = BrowserWindow.fromWebContents(event.sender)

  const options = {
    type: 'warning',
    buttons: ['Delete', 'Cancel'],
    defaultId: 0,
    title: 'Delete Product',
    message: `Are you sure you want to delete the product "${product.name}"?`,
    detail: 'This action cannot be undone.'
  }

  return await dialog
    .showMessageBox(window, options)
    .then((dialogResponse) => dialogResponse.response === 0)
    .then((shouldDelete) => {
      if (shouldDelete) {
        productRepository.delete(product)
        return true
      }
      return false
    })
})

ipcMain.handle('get-products', async (_, from, size, filters) => {
  return await productRepository.get(from, size, filters)
})

ipcMain.handle('add-product', async (_, product) => {
  return await productRepository.create(product)
})

ipcMain.handle('update-product', async (_, product) => {
  return await productRepository.update(product)
})

const imageUtil = new ImageUtil()

ipcMain.handle('choose-image-file', async (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  const result = await dialog.showOpenDialog(window, {
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp'] }]
  })

  if (!result.canceled) {
    return await imageUtil.resize(result.filePaths[0], 600, 400)
  }
})

ipcMain.handle('read-image-file', async (event, imagePath) => {
  return await imageUtil.fileToBase64(imagePath)
})
