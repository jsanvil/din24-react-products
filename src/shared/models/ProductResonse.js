export default class ProductResponse {
  /**
   * @param {string} code
   * @param {string} message
   */
  constructor(result, error = null) {
    this.result = result
    this.error = error
  }
}
