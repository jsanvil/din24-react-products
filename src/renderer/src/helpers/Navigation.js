import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/appSlice'

/**
 * Class to centralize navigation in the application
 * @example
 * // Instantiate
 * const nav = new Navigation()
 * // Use methods
 * nav.mainList()
 */
export default class Navigation {
  constructor() {
    this.navigate = useNavigate()
    this.dispatch = useDispatch()
  }

  dispatchTitle(title) {
    this.dispatch(setTitle(title))
  }

  mainList() {
    this.dispatchTitle('mainView.title')
    this.navigate('/')
  }

  productEdit(id) {
    this.dispatchTitle('formView.titleEdit')
    this.navigate(`/edit/${id}`)
  }

  newProduct() {
    this.dispatchTitle('formView.newTitle')
    this.navigate('/create')
  }

  productDetail(id) {
    this.dispatchTitle('detailView.title')
    this.navigate(`/detail/${id}`)
  }
}
