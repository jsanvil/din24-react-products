'use strict'
// @ts-check

import { app, Menu, nativeTheme, dialog } from 'electron'
import { join } from 'path'
import { whitelist } from './i18next.main.config'
import AppSettingsStorage from './utils/AppSettingsStorage'

/**
 * Módulo para configurar el menú de la aplicación
 * @module menu
 */

/**
 * Configura el menú principal de la aplicación
 * @param {BrowserWindow} win - Ventana principal de la aplicación
 * @param {AppSettingsStorage} settingsStorage - Almacenamiento de la configuración de la aplicación
 */
export function setMainMenu(win, settingsStorage, i18n) {
  const t = i18n.t
  const template = [
    {
      label: t('mainMenu.appName'),
      submenu: [
        {
          label: t('mainMenu.appName-quit'),
          click: () => {
            app.quit()
          },
          accelerator: 'CmdOrCtrl+Q'
        }
      ]
    },
    {
      label: t('mainMenu.options'),
      submenu: [
        {
          label: t('mainMenu.options-darkMode'),
          click: () => {
            win.webContents.send('update-theme', 'dark')
            nativeTheme.themeSource = 'dark'
            settingsStorage.set('theme', 'dark')
          },
          type: 'radio',
          checked: nativeTheme.themeSource === 'dark'
        },
        {
          label: t('mainMenu.options-lightMode'),
          click: () => {
            win.webContents.send('update-theme', 'light')
            nativeTheme.themeSource = 'light'
            settingsStorage.set('theme', 'light')
          },
          type: 'radio',
          checked: nativeTheme.themeSource === 'light'
        },
        {
          label: t('mainMenu.options-language'),
          submenu: whitelist.map((langCode) => ({
            label: t(`mainMenu.options-language-${langCode}`),
            type: 'radio',
            checked: i18n.language === langCode,
            click: () => {
              i18n.changeLanguage(langCode), settingsStorage.set('language', langCode)
            }
          }))
        },
        // Show dev tools only in development
        ...(app.isPackaged
          ? []
          : [{ type: 'separator' }, { role: 'reload' }, { role: 'toggledevtools' }])
      ]
    },
    {
      label: t('mainMenu.help'),
      submenu: [
        {
          label: t('mainMenu.help-about'),
          click: () => {
            dialog.showMessageBox(win, {
              title: t('mainMenu.help-about-title'),
              message: t('mainMenu.help-about-message'),
              detail: t('mainMenu.help-about-detail'),
              icon: join(__dirname, '../assets/icon.png'),
              buttons: []
            })
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
