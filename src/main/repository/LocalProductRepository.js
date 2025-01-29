import { join } from 'path'
import fs from 'fs'
import SimpleJsonStorage from './SimpleJsonStorage'
import BaseProductRepository from './BaseProductRepository'
import ImageUtil from '../utils/ImageUtil'

const DELAY_ENABLED = true

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
    const userAppDir = app.getPath('userData')
    const file = 'products.json'
    this.SimpleJsonStorage = new SimpleJsonStorage(join(userAppDir, file))
    this.products = []
    this.imagePath = join(userAppDir, 'productImages')
    // create image directory
    if (!fs.existsSync(this.imagePath)) {
      fs.mkdirSync(this.imagePath, { recursive: true })
    }
    this.imageUtil = new ImageUtil()
  }

  /**
   * Load products from file
   * @returns {Promise<void>}
   */
  async load() {
    await randomTimeout()
    this.products = await this.SimpleJsonStorage.read()
  }

  async save() {
    await randomTimeout()
    await this.SimpleJsonStorage.write(this.products)
  }

  /**
   * Get all products
   * @returns {Promise<Product[]>} List of products
   */
  async getAll() {
    await randomTimeout()
    return this.products
  }

  async get(from = 0, size = 2) {
    await randomTimeout()
    return this.products.slice(from, from + size)
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
