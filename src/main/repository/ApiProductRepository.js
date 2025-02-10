import BaseProductRepository from './BaseProductRepository'
import ImageUtil from '../utils/ImageUtil'
import ProductResponse from '../../shared/models/ProductResonse'

const API_URL = 'https://api-example.jacinto-sanchez.workers.dev/api/'
const ENDPOINT_PRODUCTS = 'products'

const API_KEY = import.meta.env.MAIN_VITE_API_KEY

const AUTH_HEADER = {
  'x-api-key': API_KEY
}

/**
 * Local product service
 * @extends BaseProductRepository
 */
export default class ApiProductRepository extends BaseProductRepository {
  constructor(app) {
    super(app)
    this.products = []
    this.imageUtil = new ImageUtil()
    this.productsUrl = `${API_URL}${ENDPOINT_PRODUCTS}`
  }

  /**
   * Get all products
   * @returns {Promise<Product[]>} List of products
   */
  async get(from = 0, size = 5, filters = {}) {
    let params = new URLSearchParams({ offset: from, limit: size })

    if (filters.search) {
      params.append('search', filters.search)
    }

    if (filters.sort.field) {
      params.append('sort', filters.sort.field)

      if (filters.sort.order) {
        params.append('order', filters.sort.order)
      }
    }

    if (filters.priceRange.min) {
      params.append('min_price', filters.priceRange.min)
    }

    if (filters.priceRange.max && filters.priceRange.max < 1000) {
      params.append('max_price', filters.priceRange.max)
    }

    if (filters.minStock) {
      params.append('min_stock', filters.minStock)
    }

    if (filters.date.min) {
      params.append('min_date', filters.date.min)
    }

    if (filters.date.max) {
      params.append('max_date', filters.date.max)
    }

    console.log('fetching', `${this.productsUrl}?${params}`)

    await fetch(`${this.productsUrl}?${params}`, {
      headers: AUTH_HEADER
    })
      .then((res) => {
        if (!res.ok) {
          res.json().then((error) => {
            return ProductResponse(null, error.json())
          })
        }
        return res.json()
      })
      .then((data) => {
        console.log('Products', data)
        this.products = data.results
      })
    return new ProductResponse(this.products)
    // return this.products
  }

  /**
   * Create a new product
   * @param {Product} product Product data
   * @returns {Promise<Product>} Product created
   */
  async create(product) {
    const data = await fetch(this.productsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...AUTH_HEADER
      },
      body: JSON.stringify(product)
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error creating product', error)
      })

    return data
  }

  /**
   * Update a product
   * @param {Product} product Product data
   * @returns {Promise<Product>} Product updated
   */
  async update(product) {
    console.log('Updating product', product)
    const data = await fetch(`${this.productsUrl}/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...AUTH_HEADER
      },
      body: JSON.stringify(product)
    }).then((res) => res.json())

    return data
  }

  /**
   * Delete a product
   * @param {Product} id Product to delete
   * @returns {Promise<void>}
   */
  async delete(id) {
    console.log('Deleting product', id)
    return await fetch(`${this.productsUrl}/${id}`, {
      method: 'DELETE',
      headers: AUTH_HEADER
    }).then((res) => res.json())
  }

  /**
   * Get a product by id
   * @param {string} id Product id
   * @returns {Promise<Product>} Product
   */
  async getById(id) {
    console.log('Getting product by id', id)

    const data = await fetch(`${this.productsUrl}/${id}`, {
      headers: AUTH_HEADER
    }).then((res) => res.json())
    return data
  }
}
