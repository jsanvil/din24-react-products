/* eslint-disable react/prop-types */
import { Button, Card, Container } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { deleteProduct } from '../redux/productsSlice'
import Navigation from '../helpers/Navigation'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

export default function ProductListItem({ productId }) {
  const nav = new Navigation()
  const dispatch = useDispatch()
  const product = useSelector((state) => state.products.list.find((p) => p.id === productId))

  const [imageBase64, setImageBase64] = useState('')

  useEffect(() => {
    if (!product) {
      nav.productList()
    }

    const getBase64Image = async () => {
      await window.api
        .getImage(product.image)
        .then((base64data) => {
          setImageBase64(base64data)
        })
        .catch(() => {
          toast.error(`Error al obtener la imagen`, { toastId: 'get-image' })
        })
    }

    if (product?.image) {
      getBase64Image()
    }

    return () => {
      setImageBase64('')
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
    <Card className="product-list-item" onClick={handleDetails}>
      <Card.Header className="text-truncate">{product.name}</Card.Header>
      <div className="product-list-item-image-container">
        {!imageBase64 && <i className="product-list-item-image-empty bi bi-image-fill" />}
        {imageBase64 && (
          <Card.Img
            className="product-list-item-image"
            variant="item"
            src={`data:image/webp;base64,${imageBase64}`}
          />
        )}
      </div>
      <Card.Body>
        <Card.Subtitle className="mb-2 text-muted">
          {new Intl.NumberFormat().format(product.price)}
        </Card.Subtitle>
        <Card.Text>Stock: {product.stock}</Card.Text>
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
