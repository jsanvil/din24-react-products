import SimpleJsonStorage from './SimpleJsonStorage'

/**
 * Storage class for application settings
 */
export default class AppSettingsStorage extends SimpleJsonStorage {
  /**
   * @param {string} filename - Name of the file to store the data
   * @throws {Error} If the filename is invalid
   */
  constructor(filename) {
    super(filename)
  }

  async read() {
    return super.read({})
  }

  async load() {
    this.settings = (await this.read()) || {}
    return this.settings
  }

  async set(key, value) {
    this.settings[key] = value
    await this.write(this.settings)
  }
}
