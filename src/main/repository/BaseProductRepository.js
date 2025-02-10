/* eslint-disable no-unused-vars */

import Filters from '../../shared/models/Filters'
import Product from '../../shared/models/Product'

/**
 * Base product service class
 * @abstract
 */
export default class BaseProductRepository {
  constructor(app) {
    this.app = app
  }

  /**
   * Get all products
   * @param {Filters} filters Filters to apply to the query (optional)
   * @returns {Promise<Product[]>} List of products
   */
  async get(filters = new Filters()) {
    throw new Error('Method not implemented')
  }

  /**
   * Create a new product
   * @param {Product} product Product data
   * @returns {Promise<Product>} Product created
   */
  async create(product) {
    throw new Error('Method not implemented')
  }

  /**
   * Update a product
   * @param {Product} product Product data
   * @returns {Promise<Product>} Product updated
   */
  async update(product) {
    throw new Error('Method not implemented')
  }

  /**
   * Delete a product
   * @param {Product} product Product to delete
   * @returns {Promise<void>}
   */
  async delete(product) {
    throw new Error('Method not implemented')
  }

  /**
   * Get a product by id
   * @param {string} id Product id
   * @returns {Promise<Product>} Product
   */
  async getById(id) {
    throw new Error('Method not implemented')
  }
}
