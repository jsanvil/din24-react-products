export default class ProductService {
  constructor() {
    this.list = []
  }

  /**
   * Get all products
   * @returns {Promise<Product[]>} List of products
   */
  async getAll() {
    const result = await window.api.getProducts()
    this.list = result
    return result
  }

  /**
   * Get a list of products with pagination
   * @param {number} from Starting index
   * @param {number} size Number of products to get
   * @returns {Promise<Product[]>} List of products
   */
  async get(from = 0, size = 2) {
    let resultList
    await window.api.getProducts(from, size).then((result) => {
      this.list = this.list.concat(result)
      resultList = result
    })
    return resultList
  }

  /**
   * Create a new product
   * @param {Product} product Product data
   * @returns {Promise<Product>} Product created
   */
  async create(product) {
    const result = await window.api.addProduct(product)
    return result
  }

  /**
   * Delete a product
   * @param {Product} product Product to delete
   * @returns {Promise<void>}
   */
  async delete(product) {
    const result = await window.api.deleteProduct(product)

    if (result) {
      this.list = this.list.filter((p) => p.id !== product.id)
    }
  }

  /**
   * Update a product
   * @param {Product} product Product to update
   * @returns {Promise<Product>} Updated product
   */
  async update(product) {
    const result = await window.api.updateProduct(product)

    if (result) {
      this.list = this.list.map((p) => (p.id === product.id ? product : p))
    }

    return result
  }
}
