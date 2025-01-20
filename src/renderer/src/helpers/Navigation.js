import { useNavigate } from 'react-router-dom'

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
  }

  mainList() {
    this.navigate('/')
  }

  productEdit(id) {
    this.navigate(`/edit/${id}`)
  }

  newProduct() {
    this.navigate('/create')
  }

  productDetail(id) {
    this.navigate(`/detail/${id}`)
  }
}
