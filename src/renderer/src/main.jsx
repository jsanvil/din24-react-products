// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { Provider } from 'react-redux'
import { store } from './redux/store'
// import '../i18next.renderer.config'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18next.renderer.config'

// Escuchar el evento de cambio de tema
window.api.onUpdateTheme((_, theme) => {
  document.documentElement.setAttribute('data-bs-theme', theme)
})

window.api.onChangeLanguage((_, language) => {
  i18n.changeLanguage(language)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
    <App />
  </Provider>
  // </React.StrictMode>
)
