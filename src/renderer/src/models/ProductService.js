// import redux
import { store } from '../redux/store'
import { setLoading, hideLoading, setLoadingMore } from '../redux/appSlice'
import { setProducts, addProducts, deleteProduct, updateProduct } from '../redux/productsSlice'

export default class ProductService {
  constructor() {}

  showLoading(message = 'Cargando...') {
    store.dispatch(setLoading({ status: true, text: message }))
  }

  hideLoading() {
    store.dispatch(hideLoading())
  }

  /**
   * Get all products
   * @returns {Promise<Product[]>} List of products
   */
  async getAll() {
    const result = await window.api.getProducts()
    return result
  }

  async loadMore(from, size, filters = {}) {
    store.dispatch(setLoadingMore(true))
    const result = await window.api.getProducts(from, size, filters).finally(() => {
      store.dispatch(setLoadingMore(false))
    })
    store.dispatch(addProducts(result))
    // this.list = this.list.concat(result)
    return result
  }

  /**
   * Get a list of products with pagination
   * @param {number} from Starting index
   * @param {number} size Number of products to get
   * @returns {Promise<Product[]>} List of products
   */
  async get(from = 0, size = 5, filters = {}) {
    this.showLoading()
    const result = await window.api.getProducts(from, size, filters).finally(() => {
      this.hideLoading()
    })

    if (result) {
      store.dispatch(setProducts(result))
    }
  }

  /**
   * Create a new product
   * @param {Product} product Product data
   * @returns {Promise<Product>} Product created
   */
  async create(product) {
    const result = await window.api.addProduct(product)
    return result
  }

  /**
   * Delete a product
   * @param {Product} product Product to delete
   * @returns {Promise<void>}
   */
  async delete(product) {
    const result = await window.api.deleteProduct(product)

    if (result) {
      // this.list = this.list.filter((p) => p.id !== product.id)
      store.dispatch(deleteProduct(product))
    }
  }

  /**
   * Update a product
   * @param {Product} product Product to update
   * @returns {Promise<Product>} Updated product
   */
  async update(product) {
    const result = await window.api.updateProduct(product)

    if (result) {
      // this.list = this.list.map((p) => (p.id === product.id ? product : p))
      store.dispatch(updateProduct(product))
    }

    return result
  }
}
