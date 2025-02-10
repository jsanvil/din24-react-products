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
  async getProducts() {
    this.showLoading()
    await this.api
      .getProducts(this.getFilters())
      .then((response) => {
        if (response.errors) {
          toast.error(getErrorMessage(response.error), { toastId: 'get-products' })
          return
        } else {
          store.dispatch(setProducts(response.result))
        }
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
  productNotFound: {
    error: 'product-not-found',
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

const getErrorMessage = (error) => {
  if (error.key === ERRORS.queryFailed.error) {
    return 'Error al ejecutar la consulta'
  }
  if (error.key === ERRORS.postDuplicated.error) {
    return 'El producto ya existe'
  }
  if (error.key === ERRORS.requiredFields.error) {
    return 'Nombre y precio son requeridos'
  }
  if (error.key === ERRORS.imageSize.error) {
    return 'El tamaño de la imagen debe ser menor a 512KB'
  }
  if (error.key === ERRORS.imageInvalid.error) {
    return 'URL de imagen o cadena base64 inválida'
  }
  if (error.key === ERRORS.productNotFound.error) {
    return 'Producto no encontrado'
  }
  if (error.key === ERRORS.putNotFound.error) {
    return 'Producto no encontrado'
  }
  if (error.key === ERRORS.deleteNotFound.error) {
    return 'Producto no encontrado'
  }
  if (error.key === ERRORS.invalidQuerySearch.error) {
    return 'Consulta de búsqueda no inválida'
  }
  if (error.key === ERRORS.invalidQueryMinStock.error) {
    return 'Consulta Stock mínimo no válida'
  }
  if (error.key === ERRORS.invalidQueryMinPrice.error) {
    return 'Consulta Precio mínimo no válida'
  }
  if (error.key === ERRORS.invalidQueryMaxPrice.error) {
    return 'Consulta Precio máximo no válida'
  }
  if (error.key === ERRORS.invalidQueryMinDate.error) {
    return 'Consulta Fecha mínima no válida'
  }
  if (error.key === ERRORS.invalidQueryMaxDate.error) {
    return 'Consulta Fecha máxima no válida'
  }
  if (error.key === ERRORS.invalidQueryLimit.error) {
    return 'Consulta de límite no válida'
  }
  if (error.key === ERRORS.invalidQueryOffset.error) {
    return 'Consulta de offset no válida'
  }
  if (error.key === ERRORS.invalidQuerySort.error) {
    return 'Consulta de ordenación no válida'
  }
  if (error.key === ERRORS.invalidQueryOrder.error) {
    return 'Consulta de sentido de ordenación no válida'
  }

  return 'Error desconocido'
}
