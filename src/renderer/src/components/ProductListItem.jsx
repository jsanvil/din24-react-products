/* eslint-disable react/prop-types */
import { Button, Card, Container } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { deleteProduct } from '../redux/productsSlice'
import Navigation from '../helpers/Navigation'
import { useState, useEffect } from 'react'

export default function ProductListItem({ productId }) {
  const nav = new Navigation()
  const dispatch = useDispatch()
  const product = useSelector((state) => state.products.list.find((p) => p.id === productId))

  const [imageLoaded, setImageLoaded] = useState(product?.image?.startsWith('data:image'))
  const [hover, setHover] = useState(false)

  useEffect(() => {
    if (!product) {
      nav.productList()
    }
  }, [product])

  const handleDelete = async (event) => {
    event.stopPropagation()
    const result = await window.api.deleteProduct(product.id)
    if (result) {
      dispatch(deleteProduct(product))
    }
  }

  const handleEdit = (event) => {
    event.stopPropagation()
    nav.productEdit(product.id)
  }

  const handleDetails = (event) => {
    event.stopPropagation()
    nav.productDetail(product.id)
  }

  return (
    <Card
      className="product-list-item"
      onClick={handleDetails}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <Card.Header className="text-truncate">{product.name}</Card.Header>
      <Container className="position-relative d-flex justify-content-center align-items-center p-0 m-0 overflow-hidden product-list-item-image-container">
        {!imageLoaded && <i className="product-list-item-image-empty bi bi-image-fill" />}
        {imageLoaded && (
          <Card.Img
            className="product-list-item-image"
            variant="item"
            src={product?.image}
            onLoad={() => setImageLoaded(true)}
          />
        )}
        <Container
          className="product-item-buttons position-absolute top-0 end-0 d-flex p-1 gap-2 flex-wrap justify-content-end"
          style={{ opacity: hover ? 1 : 0 }}
        >
          <Button variant="primary btn-sm shadow-sm" onClick={handleEdit}>
            <i className="bi bi-pencil" />
          </Button>
          <Button variant="danger btn-sm shadow-sm" onClick={handleDelete}>
            <i className="bi bi-trash" />
          </Button>
        </Container>
      </Container>
      <Card.Body className="m-1 p-0">
        <Container className="d-flex justify-content-between m-0 p0">
          {product.price > 0 ? (
            <Card.Text className="m-0">{product.price}€</Card.Text>
          ) : (
            <Card.Text className="m-0 text-success">
              <i className="bi bi-gift"></i> GRATIS
            </Card.Text>
          )}
          {product.stock > 0 ? (
            <Card.Text className="fst-italic fw-light p-0 m-0 small text-end d-block m-0">
              {product.stock} en stock
            </Card.Text>
          ) : (
            <Card.Text className="text-danger fst-italic fw-light p-0 m-0 small text-end d-block">
              <i className="bi bi-x-circle"></i> Sin stock
            </Card.Text>
          )}
        </Container>
      </Card.Body>
    </Card>
  )
}
