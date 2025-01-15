'use strict'
// @ts-check

const fs = require('fs')

/**
 * Storage class for JSON files
 */
export default class SimpleJsonStorage {
  /**
   * @param {string} filename - Name of the file to store the data
   * @throws {Error} If the filename is invalid
   */
  constructor(filename) {
    if (!filename || typeof filename !== 'string' || filename.trim() === '') {
      throw new Error('El nombre del archivo es inválido')
    }

    this.filename = filename
  }

  /**
   * Read the data from the file
   * @param {Array} [init=[]] - Default data if the file does not exist
   * @returns {Array} Data read from the file
   */
  async read(init = []) {
    if (!fs.existsSync(this.filename)) {
      this.write(init)
      return init
    }
    const data = await fs.readFileSync(this.filename, 'utf-8')
    return JSON.parse(data)
  }

  /**
   * Write data to the file
   * @param {Array} data - Data to write
   * @throws {Error} If the data is invalid or cannot be written
   */
  async write(data) {
    await fs.writeFileSync(this.filename, JSON.stringify(data, null, 2))
  }
}
