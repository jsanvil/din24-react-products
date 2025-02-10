export default class Filters {
  constructor(filters = {}) {
    this.search = filters?.search || ''
    this.sort = {
      field: filters?.sort?.field || '',
      order: filters?.sort?.order || ''
    }
    this.priceRange = {
      min: filters?.priceRange?.min || 0,
      max: filters?.priceRange?.max || Infinity
    }
    this.minStock = filters?.minStock || 0
    this.date = {
      min: filters?.date?.min || '',
      max: filters?.date?.max || ''
    }
  }

  setSearch(search) {
    this.search = search
  }

  setSort(field, order) {
    this.sort = { field, order }
  }

  setPriceRange(min, max) {
    this.priceRange = { min, max }
  }

  setMinStock(minStock) {
    this.minStock = minStock
  }

  setDateRange(min, max) {
    this.date = { min, max }
  }
}
