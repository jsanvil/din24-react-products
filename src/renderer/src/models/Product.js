/**
 * Product model class.
 */
export default class Product {
  /**
   * Product constructor
   * @param {string} id Product ID
   * @param {string} name Product name
   * @param {number} price Product price
   * @param {number} stock Product stock
   * @param {string} image Product image
   * @param {string} description Product description
   * @param {Date} date Product date
   */
  constructor({ id, name, price, stock, image, description, date }) {
    this.id = id ?? ''
    this.name = name ?? ''
    this.price = price ?? 0
    this.stock = stock ?? 0
    this.image = image ?? ''
    this.description = description ?? ''
    this.date = date ?? new Date()
  }
}
