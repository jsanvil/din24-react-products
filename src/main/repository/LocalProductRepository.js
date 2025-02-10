import { join } from 'path'
import fs from 'fs'
import SimpleJsonStorage from '../utils/SimpleJsonStorage'
import BaseProductRepository from './BaseProductRepository'
import ImageUtil from '../utils/ImageUtil'
import Filters from '../../shared/models/Filters'
import Product from '../../shared/models/Product'
import ProductResponse from '../../shared/models/ProductResonse'
import { ERROR } from '../../shared/constants/Errors'

const DELAY_ENABLED = false

async function randomTimeout() {
  if (!DELAY_ENABLED) {
    return
  }
  return new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 3 * 1000)
  })
}

/**
 * Local product service
 * @extends BaseProductRepository
 */
export default class LocalProductRepository extends BaseProductRepository {
  constructor(app) {
    super(app)

    /**
     * @type {Product[]}
     */
    this.products = []

    /**
     * @type {ImageUtil}
     */
    this.imageUtil = new ImageUtil()

    const userAppDir = app.getPath('userData')
    const fileName = 'products.json'
    this.SimpleJsonStorage = new SimpleJsonStorage(join(userAppDir, fileName))
    // this.imagePath = join(userAppDir, 'productImages')
    // // create image directory
    // if (!fs.existsSync(this.imagePath)) {
    //   fs.mkdirSync(this.imagePath, { recursive: true })
    // }
  }

  /**
   * Load products from file
   * @returns {Promise<void>}
   */
  async load() {
    await randomTimeout()
    await this.SimpleJsonStorage.read().then((data) => {
      this.products = []
      data.forEach((p) => {
        this.products.push(new Product(p))
      })
    })
  }

  async save() {
    await randomTimeout()
    await this.SimpleJsonStorage.write(this.products)
  }

  /**
   * @param {Filters} filters
   * @returns {Promise<Product[]>}
   */
  async get(filters = {}) {
    await randomTimeout()

    let result = [...this.products]

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(search))
    }

    if (filters?.priceRange?.min) {
      if (filters.priceRange.min < 0) {
        return ProductResponse(null, ERROR.invalidQueryMinPrice)
      }
      result = result.filter((p) => p.price >= filters.priceRange.min)
    }

    if (filters?.priceRange?.max && filters?.priceRange?.max < 1000) {
      result = result.filter((p) => p.price <= filters.priceRange.max)
    }

    if (filters?.minStock) {
      result = result.filter((p) => p.stock >= filters.minStock)
    }

    if (filters?.date?.min) {
      result = result.filter((p) => p.createdAt >= filters.date.min)
    }

    if (filters?.date?.max) {
      result = result.filter((p) => p.createdAt <= filters.date.max)
    }

    if (filters?.sort?.field) {
      console.log('Sorting', filters.sort)
      result.sort((a, b) => {
        const field = filters.sort.field
        const order = filters.sort?.order === 'asc' ? 1 : -1
        const type = typeof a[field]
        if (type === 'string') {
          return a[field].localeCompare(b[field]) * order
        }
        return (a[field] - b[field]) * order
      })
    }

    const offset = filters?.offset || 0
    const limit = offset + (filters?.limit || 5)

    return new ProductResponse(result.slice(offset, limit))
  }

  /**
   * Create a new product
   * @param {Product} product Product data
   * @returns {Promise<Product>} Product created
   */
  async create(product) {
    await randomTimeout()
    product.id = crypto.randomUUID()
    if (product.imageBase64) {
      // convert base64 to file and get the path
      const imagePath = join(this.imagePath, `${product.id}.webp`)
      await this.imageUtil.base64ToFile(product.imageBase64, imagePath)
      product.image = imagePath
    }
    product.imageBase64 = null
    delete product.updatedImage
    this.products.push(product)
    await this.save()
    return product
  }

  /**
   * Update a product
   * @param {Product} product Product data
   * @returns {Promise<Product>} Product updated
   */
  async update(product) {
    await randomTimeout()
    const index = this.products.findIndex((p) => p.id === product.id)
    if (index === -1) {
      throw new Error('Product not found')
    }
    if (product.updatedImage) {
      if (product.imageBase64) {
        // convert base64 to file and get the path
        const imagePath = join(this.imagePath, `${product.id}.webp`)
        await this.imageUtil.base64ToFile(product.imageBase64, imagePath)
        product.image = imagePath
      } else {
        if (product.image) {
          // delete image
          fs.unlinkSync(product.image)
        }
        product.image = null
      }
    }
    product.imageBase64 = null
    delete product.updatedImage
    this.products[index] = product
    await this.save()
    return product
  }

  /**
   * Delete a product
   * @param {Product} id Product to delete
   * @returns {Promise<void>}
   */
  async delete(id) {
    await randomTimeout()
    this.products = this.products.filter((p) => p.id !== id)
    await this.save()
  }

  /**
   * Get a product by id
   * @param {string} id Product id
   * @returns {Promise<Product>} Product
   */
  async getById(id) {
    await randomTimeout()
    return this.products.find((p) => p.id === id)
  }
}
