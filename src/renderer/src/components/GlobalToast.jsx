import { useState, useEffect } from 'react'
import Toast from 'react-bootstrap/Toast'

export default function GlobalToast() {
  /**
   * Estado local para almacenar el mensaje de toast.
   */
  const [toastMessage, setToastMessage] = useState('')

  /**
   * Efecto de inicialización, se ejecuta una sola vez al montar el componente.
   *
   * Este efecto se encarga de escuchar eventos de toast desde el proceso principal
   * y desde otros componentes de la aplicación.
   */
  useEffect(() => {
    const handleToast = (event) => {
      showToastMessage(event.message)
    }

    // receive main process message
    window.electron.ipcRenderer.on('toast', (_, message) => {
      showToastMessage(message)
    })

    // receive internal renderer message
    window.addEventListener('toast', handleToast)

    return () => {
      // remove listeners when component is unmounted
      window.removeEventListener('toast', handleToast)
      window.electron.ipcRenderer.removeAllListeners('toast')
    }
  }, [])

  const showToastMessage = (message) => {
    setToastMessage('')
    setTimeout(() => {
      setToastMessage(message)
    }, 0)
  }

  return (
    <Toast
      onClose={() => setToastMessage('')}
      show={toastMessage.length > 0}
      delay={2000}
      autohide
      style={{
        position: 'absolute',
        bottom: 10,
        right: 10
      }}
    >
      <Toast.Body>
        {toastMessage}
        <button type="button" className="btn-close float-end" onClick={() => setToastMessage('')} />
      </Toast.Body>
    </Toast>
  )
}
