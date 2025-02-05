// import redux
import { store } from '../redux/store'
import { setLoading, hideLoading, setLoadingMore } from '../redux/appSlice'
import { setProducts, addProducts, deleteProduct, updateProduct } from '../redux/productsSlice'
import { toast } from 'react-toastify'

const LIMIT = 5

export default class ProductService {
  constructor() {
    this.api = window.api
  }

  showLoading(message = 'Cargando...') {
    store.dispatch(setLoading({ status: true, text: message }))
  }

  hideLoading() {
    store.dispatch(hideLoading())
  }

  getFilters() {
    return store.getState().products.filters
  }

  async loadMore(from, size = LIMIT) {
    store.dispatch(setLoadingMore(true))
    await this.api
      .getProducts(from, size, this.getFilters())
      .then((result) => {
        if (result.length === 0) {
          toast.info(`No hay más productos para mostrar`, { toastId: 'load-more-products' })
          return
        }
        store.dispatch(addProducts(result))
      })
      .catch(() => {
        toast.error('Error al cargar más productos', { toastId: 'load-more-products' })
      })
      .finally(() => {
        store.dispatch(setLoadingMore(false))
      })
  }

  /**
   * Get a list of products with pagination
   * @param {number} from Starting index
   * @param {number} size Number of products to get
   * @returns {Promise<Product[]>} List of products
   */
  async getProducts(from = 0, size = LIMIT) {
    this.showLoading()
    await this.api
      .getProducts(from, size, this.getFilters())
      .then((result) => {
        store.dispatch(setProducts(result))
      })
      .catch(() => {
        toast.error('Error al cargar los productos', { toastId: 'get-products' })
      })
      .finally(() => {
        this.hideLoading()
      })
  }

  /**
   * Create a new product
   * @param {Product} product Product data
   * @returns {Promise<void>} Product created
   */
  async create(product) {
    console.log('Creating product', product)
    this.showLoading('Creando producto')
    const [result] = await this.api
      .addProduct(product)
      .catch(() => {
        toast.error('Error al crear el producto', { toastId: 'create-product' })
      })
      .finally(() => {
        this.hideLoading()
      })

    console.log('Product created', result)

    if (result) {
      toast.success('Producto creado correctamente', { toastId: 'create-product' })
      store.dispatch(addProducts([result]))
    }

    return result
  }

  /**
   * Delete a product
   * @param {Product} product Product to delete
   * @returns {Promise<void>}
   */
  async delete(product) {
    this.showLoading('Eliminando producto')

    await this.api
      .deleteProduct(product)
      .then(() => {
        toast.success('Producto eliminado correctamente', { toastId: 'delete-product' })
        store.dispatch(deleteProduct(product))
      })
      .catch(() => {
        toast.error(`Error al eliminar el producto`, { toastId: 'delete-product' })
      })
      .finally(() => {
        this.hideLoading()
      })
  }

  /**
   * Update a product
   * @param {Product} product Product to update
   * @returns {Promise<void>}
   */
  async update(product) {
    console.log('Updating product', product)
    this.showLoading('Actualizando producto')

    const [result] = await this.api
      .updateProduct(product)
      .catch(() => {
        toast.error('Error al actualizar el producto', { toastId: 'update-product' })
      })
      .finally(() => {
        this.hideLoading()
      })

    if (result) {
      toast.success('Producto actualizado correctamente', { toastId: 'update-product' })
      store.dispatch(updateProduct(result))
    }

    return result
  }
}
