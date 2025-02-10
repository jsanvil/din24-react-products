import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import backend from 'i18next-electron-fs-backend'

export const whitelist = ['en', 'es']

i18n
  .use(backend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: './src/locales/{{lng}}/{{ns}}.json',
      addPath: './src/locales/{{lng}}/{{ns}}.missing.json',
      contextBridgeApiKey: 'api' // needs to match first parameter of contextBridge.exposeInMainWorld in preload file; defaults to "api"
    },

    // other options you might configure
    debug: true,
    saveMissing: true,
    saveMissingTo: 'current',
    lng: 'en',
    fallbackLng: false, // set to false when generating translation files locally
    supportedLngs: whitelist
  })

export default i18n
