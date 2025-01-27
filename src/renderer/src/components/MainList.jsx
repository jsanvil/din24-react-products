import { Button, Container } from 'react-bootstrap'
import ProductList from './ProductList'
import Navigation from '../helpers/Navigation'

export default function MainList() {
  const nav = new Navigation()

  return (
    <Container className="my-3">
      <Button variant="primary" onClick={() => nav.newProduct()}>
        Crear producto
      </Button>
      <ProductList />
    </Container>
  )
}
