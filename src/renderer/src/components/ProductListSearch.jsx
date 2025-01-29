import { Form, Button } from 'react-bootstrap'

export default function ProductListSearch() {
  const handleSearch = (e) => {
    e.preventDefault()
    const searchText = e.target.value
    // TODO: Implement search
  }

  return (
    <>
      <Form className="d-flex">
        <Form.Control
          onClick={handleSearch}
          type="search"
          placeholder="Buscar producto..."
          className="me-2"
          aria-label="Search"
        />
        <Button variant="outline-primary">
          <i className="bi bi-search"></i>
        </Button>
      </Form>
    </>
  )
}
