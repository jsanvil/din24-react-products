import { useSelector } from 'react-redux'
import { Container, Button, Spinner } from 'react-bootstrap'
import ProductService from '../models/ProductService'
import ProductListItem from './ProductListItem'

export default function ProductList() {
  const service = new ProductService()
  const productList = useSelector((state) => state.products.list)
  const loadingMore = useSelector((state) => state.app.loading.loadingMore)

  const loadMore = async () => {
    const from = productList.length
    const size = 5

    await service.loadMore(from, size)
  }

  return (
    <>
      <Container fluid className="product-list my-3 mx-0 px-0">
        {productList.map((product) => (
          <ProductListItem key={product.id} productId={product.id} />
        ))}
      </Container>
      <Button type="button" onClick={loadMore} disabled={loadingMore}>
        <Spinner className="me-2" animation="border" size="sm" hidden={!loadingMore} />
        <span>{loadingMore ? 'Cargando...' : 'Cargar más'}</span>
      </Button>
    </>
  )
}
