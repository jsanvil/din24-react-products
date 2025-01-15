export const dispatchToastMessage = (message) => {
  const toastEvent = new Event('toast')
  toastEvent.message = message
  window.dispatchEvent(toastEvent)
}
