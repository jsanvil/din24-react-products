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
      <ProductList />
    </Container>
  )
}
