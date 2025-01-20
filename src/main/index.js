import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import LocalProductRepository from './repository/LocalProductRepository'
import ImageUtil from './utils/ImageUtil'

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

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

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
  }
})

let productRepository

async function initStorage() {
  productRepository = new LocalProductRepository(app)
  await productRepository.load()
}

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle('delete-product', async (event, product) => {
  console.log('Deleting product:', product)
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

ipcMain.handle('get-products', async (_, from, size) => {
  return await productRepository.get(from, size)
})

ipcMain.handle('add-product', async (_, product) => {
  return await productRepository.create(product)
})

ipcMain.handle('update-product', async (_, product) => {
  return await productRepository.update(product)
})

ipcMain.handle('choose-image-file', async (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  const result = await dialog.showOpenDialog(window, {
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png'] }]
  })

  if (!result.canceled) {
    return await ImageUtil.resize(result.filePaths[0], 600, 400)
  }
})

ipcMain.handle('read-image-file', async (event, imagePath) => {
  return await ImageUtil.fileToBase64(imagePath)
})
