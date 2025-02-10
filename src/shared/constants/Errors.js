// Definition of error constants

// The ERROR object contains a set of predefined error codes and messages
// that can be used throughout the application to standardize error handling.
// Each error has a unique code and a descriptive message to help identify
// and troubleshoot issues more effectively.

export const ERROR = {
  queryFailed: {
    code: 'query-failed',
    message: 'Failed to execute query'
  },
  postDuplicated: {
    code: 'post-duplicated',
    message: 'Product already exists'
  },
  requiredFields: {
    code: 'required-fields',
    message: 'Required fields: name and price'
  },
  imageSize: {
    code: 'image-size',
    message: 'Image size must be less than 512KB'
  },
  imageInvalid: {
    code: 'image-invalid',
    message: 'Invalid image URL or invalid base64 string'
  },
  productNotFound: {
    code: 'product-not-found',
    message: 'Product not found'
  },
  invalidQuerySearch: {
    code: 'invalid-query-search',
    message: 'Invalid "search" query parameter'
  },
  invalidQueryMinStock: {
    code: 'invalid-query-min-stock',
    message: 'Invalid "min_stock" query parameter'
  },
  invalidQueryMinPrice: {
    code: 'invalid-query-min-price',
    message: 'Invalid "min_price" query parameter'
  },
  invalidQueryMaxPrice: {
    code: 'invalid-query-max-price',
    message: 'Invalid "max_price" query parameter'
  },
  invalidQueryMinDate: {
    code: 'invalid-query-min-date',
    message: 'Invalid "min_date" query parameter'
  },
  invalidQueryMaxDate: {
    code: 'invalid-query-max-date',
    message: 'Invalid "max_date" query parameter'
  },
  invalidQueryLimit: {
    code: 'invalid-query-limit',
    message: 'Invalid "limit" query parameter'
  },
  invalidQueryOffset: {
    code: 'invalid-query-offset',
    message: 'Invalid "offset" query parameter'
  },
  invalidQuerySort: {
    code: 'invalid-query-sort',
    message: 'Invalid "sort" query parameter'
  },
  invalidQueryOrder: {
    code: 'invalid-query-order',
    message: 'Invalid "order" query parameter'
  }
}
