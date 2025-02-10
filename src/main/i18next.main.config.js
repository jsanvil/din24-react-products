import i18n from 'i18next'
import backend from 'i18next-fs-backend'

// On Mac, the folder for resources isn't
// in the same directory as Linux/Windows;
// https://www.electron.build/configuration/contents#extrafiles
import path from 'path'
const isMac = process.platform === 'darwin'
const isDev = process.env.NODE_ENV === 'development'
const prependPath = isMac && !isDev ? path.join(process.resourcesPath, '..') : '.'
export const whitelist = ['en', 'es']

i18n.use(backend).init({
  backend: {
    loadPath: prependPath + '/src/locales/{{lng}}/{{ns}}.json',
    addPath: prependPath + '/src/locales/{{lng}}/{{ns}}.missing.json',
    contextBridgeApiKey: 'api'
  },
  debug: false,
  namespace: 'translation',
  saveMissing: true,
  saveMissingTo: 'current',
  lng: 'en',
  fallbackLng: false, // set to false when generating translation files locally
  supportedLngs: whitelist
})

export default i18n
