import { useDispatch, useSelector } from 'react-redux'
import { addProducts } from '../redux/productsSlice'
import ProductService from '../models/ProductService'
import ProductListItem from './ProductListItem'
import { Container, Button } from 'react-bootstrap'

export default function ProductList() {
  const productList = useSelector((state) => state.products.list)
  const repository = new ProductService()
  const dispatch = useDispatch()

  const loadMore = async () => {
    const from = productList.length
    const size = 2
    await repository.get(from, size).then((result) => {
      dispatch(addProducts(result))
    })
  }

  return (
    <>
      <Container fluid className="product-list my-3 mx-0 px-0">
        {productList.map((product) => (
          <ProductListItem key={product.id} productId={product.id} />
        ))}
      </Container>
      <Button type="button" onClick={loadMore}>
        Cargar más
      </Button>
    </>
  )
}
