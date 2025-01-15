/* eslint-disable no-unused-vars */
/**
 * Base product service class
 * @abstract
 */
export default class BaseProductRepository {
  /**
   * Get all products
   * @returns {Array} List of products
   */
  getAll() {
    throw new Error('Method not implemented')
  }

  /**
   * Create a new product
   * @param {Product} product Product data
   * @returns {Product} Product created
   */
  create(product) {
    throw new Error('Method not implemented')
  }

  /**
   * Update a product
   * @param {Product} product Product data
   * @returns {Product} Product updated
   */
  update(product) {
    throw new Error('Method not implemented')
  }

  /**
   * Delete a product
   * @param {Product} product Product to delete
   * @returns {void}
   */
  delete(product) {
    throw new Error('Method not implemented')
  }

  /**
   * Get a product by id
   * @param {string} id Product id
   * @returns {Product} Product
   */
  getById(id) {
    throw new Error('Method not implemented')
  }
}
