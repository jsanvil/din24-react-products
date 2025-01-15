import { join } from 'path'
import SimpleJsonStorage from './SimpleJsonStorage'
import BaseProductRepository from './BaseProductRepository'

/**
 * Local product service
 * @extends BaseProductRepository
 */
export default class LocalProductRepository extends BaseProductRepository {
  constructor(app) {
    super()
    const userAppDir = app.getPath('userData')
    const file = 'products.json'
    this.SimpleJsonStorage = new SimpleJsonStorage(join(userAppDir, file))
    this.products = []
  }

  /**
   * Load products from file
   * @returns {Promise<void>}
   */
  async load() {
    this.products = await this.SimpleJsonStorage.read()
  }

  async save() {
    await this.SimpleJsonStorage.write(this.products)
  }

  /**
   * Get all products
   * @returns {Promise<Product[]>} List of products
   */
  async getAll() {
    return this.products
  }

  /**
   * Create a new product
   * @param {Product} product Product data
   * @returns {Promise<Product>} Product created
   */
  async create(product) {
    product.id = crypto.randomUUID()
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
    const index = this.products.findIndex((p) => p.id === product.id)
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
    this.products = this.products.filter((p) => p.id !== id)
    await this.save()
  }

  /**
   * Get a product by id
   * @param {string} id Product id
   * @returns {Promise<Product>} Product
   */
  async getById(id) {
    return this.products.find((p) => p.id === id)
  }
}
