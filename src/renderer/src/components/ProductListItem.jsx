/* eslint-disable react/prop-types */
import { Button, Card, Container } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { deleteProduct } from '../redux/productsSlice'
import { useNavigate } from 'react-router-dom'

export default function ProductListItem({ productId }) {
  const product = useSelector((state) => state.products.list.find((p) => p.id === productId))
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleDelete = async (event) => {
    event.stopPropagation()
    const result = await window.api.deleteProduct(product.id)
    if (result) {
      dispatch(deleteProduct(product))
    }
  }

  const handleEdit = (event) => {
    event.stopPropagation()
    navigate(`/edit/${product.id}`)
  }

  const handleDetails = (event) => {
    event.stopPropagation()
    navigate(`/detail/${product.id}`)
  }

  return (
    <Card
      className="product-list-item"
      onClick={handleDetails}
      action
      style={{ cursor: 'pointer' }}
    >
      <Card.Header className="text-truncate">{product?.name}</Card.Header>
      <Card.Body>
        <Card.Subtitle className="mb-2 text-muted">
          {new Intl.NumberFormat().format(product?.price)}
        </Card.Subtitle>
        <Card.Text>Stock: {product?.stock}</Card.Text>
        <Container className="d-flex gap-3 flex-wrap justify-content-end">
          <Button variant="outline-primary" onClick={handleEdit}>
            <i className="bi bi-pencil" />
          </Button>
          <Button variant="outline-danger" onClick={handleDelete}>
            <i className="bi bi-trash" />
          </Button>
        </Container>
      </Card.Body>
    </Card>
  )
}
