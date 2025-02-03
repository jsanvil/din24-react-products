import { useDispatch, useSelector } from 'react-redux'
import { addProducts } from '../redux/productsSlice'
import ProductService from '../models/ProductService'
import ProductListItem from './ProductListItem'
import { Container, Button, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'

export default function ProductList() {
  const productList = useSelector((state) => state.products.list)
  const repository = new ProductService()
  const dispatch = useDispatch()
  const loadingMore = useSelector((state) => state.app.loading.loadingMore)

  const loadMore = async () => {
    const from = productList.length
    const size = 5

    const result = await repository.loadMore(from, size)

    if (result.length === 0) {
      toast.info(`No hay más productos para mostrar`, { toastId: 'get-products' })
      return
    }
    dispatch(addProducts(result))
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
