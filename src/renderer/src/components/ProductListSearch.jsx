import { Form, Button } from 'react-bootstrap'
import ProductService from '../models/ProductService'
import { useSelector, useDispatch } from 'react-redux'
import { filterSearch, setProducts } from '../redux/productsSlice'
import Loading from '../helpers/Loading'

export default function ProductListSearch() {
  const productService = new ProductService()
  const dispatch = useDispatch()
  const searchText = useSelector((state) => state.products.filters.search)

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchText) {
      return
    }

    await productService.get(0, 5, { search: searchText }).then((result) => {
      dispatch(setProducts(result))
    })
  }

  return (
    <>
      <Form className="d-flex" onSubmit={handleSearch}>
        <Form.Control
          type="search"
          placeholder="Buscar producto..."
          className="me-2"
          aria-label="Search"
          onChange={(e) => dispatch(filterSearch(e.target.value))}
          defaultValue={searchText}
        />
        <Button type="submit" variant="outline-primary">
          <i className="bi bi-search"></i>
        </Button>
      </Form>
    </>
  )
}
