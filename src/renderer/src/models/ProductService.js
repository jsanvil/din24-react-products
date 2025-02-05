// import redux
import { store } from '../redux/store'
import { setLoading, hideLoading, setLoadingMore } from '../redux/appSlice'
import {
  setProducts,
  addProducts,
  addProduct,
  deleteProduct,
  updateProduct
} from '../redux/productsSlice'
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

    const data = await this.api
      .addProduct(product)
      .catch(() => {
        toast.error('Error al crear el producto', { toastId: 'create-product' })
      })
      .finally(() => {
        this.hideLoading()
      })

    console.log('Product created', data)

    if (data?.errors) {
      const error = await data.errors[0]
      console.error('Error creating product', error)
      toast.error(getErrorMessage(error), { toastId: 'create-product' })
    } else {
      toast.success('Producto creado correctamente', { toastId: 'create-product' })
      store.dispatch(addProduct(data))
    }

    return data
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

const ERRORS = {
  queryFailed: {
    error: 'query-failed',
    message: 'Failed to execute query'
  },
  postDuplicated: {
    error: 'post-duplicated',
    message: 'Product already exists'
  },
  requiredFields: {
    error: 'required-fields',
    message: 'Name and price are required'
  },
  imageSize: {
    error: 'image-size',
    message: 'Image size must be less than 512KB'
  },
  imageInvalid: {
    error: 'image-invalid',
    message: 'Invalid image URL or base64 string'
  },
  getNotFound: {
    error: 'get-not-found',
    message: 'Product not found'
  },
  putNotFound: {
    error: 'put-not-found',
    message: 'Product not found'
  },
  deleteNotFound: {
    error: 'delete-not-found',
    message: 'Product not found'
  },
  invalidQuerySearch: {
    error: 'invalid-query-search',
    message: 'Invalid "search" query'
  },
  invalidQueryMinStock: {
    error: 'invalid-query-min-stock',
    message: 'Invalid "min_stock" query'
  },
  invalidQueryMinPrice: {
    error: 'invalid-query-min-price',
    message: 'Invalid "min_price" query'
  },
  invalidQueryMaxPrice: {
    error: 'invalid-query-max-price',
    message: 'Invalid "max_price" query'
  },
  invalidQueryMinDate: {
    error: 'invalid-query-min-date',
    message: 'Invalid "min_date" query'
  },
  invalidQueryMaxDate: {
    error: 'invalid-query-max-date',
    message: 'Invalid "max_date" query'
  },
  invalidQueryLimit: {
    error: 'invalid-query-limit',
    message: 'Invalid "limit" query'
  },
  invalidQueryOffset: {
    error: 'invalid-query-offset',
    message: 'Invalid "offset" query'
  },
  invalidQuerySort: {
    error: 'invalid-query-sort',
    message: 'Invalid "sort" query'
  },
  invalidQueryOrder: {
    error: 'invalid-query-order',
    message: 'Invalid "order" query'
  }
}

const getErrorMessage = (e) => {
  if (e.error === ERRORS.queryFailed.error) {
    return 'Error al ejecutar la consulta'
  }
  if (e.error === ERRORS.postDuplicated.error) {
    return 'El producto ya existe'
  }
  if (e.error === ERRORS.requiredFields.error) {
    return 'Nombre y precio son requeridos'
  }
  if (e.error === ERRORS.imageSize.error) {
    return 'El tamaño de la imagen debe ser menor a 512KB'
  }
  if (e.error === ERRORS.imageInvalid.error) {
    return 'URL de imagen o cadena base64 inválida'
  }
  if (e.error === ERRORS.getNotFound.error) {
    return 'Producto no encontrado'
  }
  if (e.error === ERRORS.putNotFound.error) {
    return 'Producto no encontrado'
  }
  if (e.error === ERRORS.deleteNotFound.error) {
    return 'Producto no encontrado'
  }
  if (e.error === ERRORS.invalidQuerySearch.error) {
    return 'Consulta de búsqueda no inválida'
  }
  if (e.error === ERRORS.invalidQueryMinStock.error) {
    return 'Consulta Stock mínimo no válida'
  }
  if (e.error === ERRORS.invalidQueryMinPrice.error) {
    return 'Consulta Precio mínimo no válida'
  }
  if (e.error === ERRORS.invalidQueryMaxPrice.error) {
    return 'Consulta Precio máximo no válida'
  }
  if (e.error === ERRORS.invalidQueryMinDate.error) {
    return 'Consulta Fecha mínima no válida'
  }
  if (e.error === ERRORS.invalidQueryMaxDate.error) {
    return 'Consulta Fecha máxima no válida'
  }
  if (e.error === ERRORS.invalidQueryLimit.error) {
    return 'Consulta de límite no válida'
  }
  if (e.error === ERRORS.invalidQueryOffset.error) {
    return 'Consulta de offset no válida'
  }
  if (e.error === ERRORS.invalidQuerySort.error) {
    return 'Consulta de ordenación no válida'
  }
  if (e.error === ERRORS.invalidQueryOrder.error) {
    return 'Consulta de sentido de ordenación no válida'
  }

  return 'Error desconocido'
}
