export default class Loading {
  constructor(dispatch, setLoading) {
    this.dispatch = dispatch
    this.setLoading = setLoading
  }

  showLoadingMsg(text = 'Cargando...') {
    this.dispatch(this.setLoading({ status: true, text }))
  }

  hideLoadingMsg() {
    this.dispatch(this.setLoading({ status: false, text: 'Cargando...' }))
  }
}
