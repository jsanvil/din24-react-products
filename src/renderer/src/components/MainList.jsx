import { useNavigate } from 'react-router-dom'
import { Button, Container } from 'react-bootstrap'
import ProductList from './ProductList'

export default function MainList() {
  const navigate = useNavigate()
  return (
    <Container className="my-3">
      <h1>Gestión de productos</h1>
      <Button variant="primary" onClick={() => navigate('/create')}>
        Crear producto
      </Button>
      {/* <Container fluid className="d-flex gap-3 flex-wrap my-3">
      <Container fluid className="product-list my-3"> */}
      <ProductList />
      {/* </Container> */}
    </Container>
  )
}
