import { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import ProductService from '../models/ProductService'
import { useSelector, useDispatch } from 'react-redux'
import { filterSearch } from '../redux/productsSlice'

export default function ProductListSearch() {
  const service = new ProductService()
  const dispatch = useDispatch()

  const searchText = useSelector((state) => state.products.filters.search)

  const [lastAppliedSearch, setLastAppliedSearch] = useState('')

  useEffect(() => {
    setLastAppliedSearch(searchText)
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()

    if (lastAppliedSearch === searchText) {
      return
    }

    await service.getProducts()
    setLastAppliedSearch(searchText)
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
          value={searchText}
        />
        <Button
          type="submit"
          variant={searchText === lastAppliedSearch ? 'outline-primary' : 'primary'}
          disabled={searchText === lastAppliedSearch}
        >
          <i className="bi bi-search"></i>
        </Button>
      </Form>
    </>
  )
}
