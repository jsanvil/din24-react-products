/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Container, Form, Button, FloatingLabel } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct, updateProduct } from '../redux/productsSlice'
import { useNavigate, useParams } from 'react-router-dom'
import ProductService from '../models/ProductService'
import GoMainListButton from './GoMainListButton'

export default function ProductForm() {
  const repository = new ProductService()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const product = useSelector((state) => state.products.list.find((p) => p.id === id))

  const [validated, setValidated] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    const form = event.currentTarget
    if (form.checkValidity() === false) {
      setValidated(true)
      return
    }

    setValidated(true)

    if (form.checkValidity()) {
      const formProduct = {
        id: id,
        name: form.formProductName.value,
        price: form.formProductPrice.value,
        stock: form.formProductStock.value
      }

      if (id) {
        // Update product
        const result = await repository.update(formProduct)
        console.log(result)
        if (result) {
          dispatch(updateProduct(result))
        }
      } else {
        // Create product
        const result = await repository.create(formProduct)
        if (result) {
          dispatch(addProduct(result))
        }
      }

      form.reset()
      setValidated(false)
      form.formProductName.focus()
      navigate('/')
    }
  }

  return (
    <Container>
      <h1>{id ? 'Editando Producto' : 'Nuevo Producto'}</h1>
      <GoMainListButton />
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        className="d-flex flex-column gap-3"
      >
        {id ? (
          <FloatingLabel controlId="formProductId" label="ID">
            <Form.Control type="text" readOnly disabled defaultValue={id} />
          </FloatingLabel>
        ) : null}
        <FloatingLabel controlId="formProductName" label="Name">
          <Form.Control type="text" placeholder="" required defaultValue={product?.name} />
          <Form.Control.Feedback type="invalid">
            Please provide a product name.
          </Form.Control.Feedback>
        </FloatingLabel>
        <FloatingLabel controlId="formProductPrice" label="Price">
          <Form.Control
            type="number"
            placeholder=""
            required
            min={0}
            defaultValue={product?.price}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a product price.
          </Form.Control.Feedback>
        </FloatingLabel>
        <FloatingLabel controlId="formProductStock" label="Stock">
          <Form.Control
            type="number"
            placeholder=""
            required
            min={0}
            defaultValue={product?.stock}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a product stock.
          </Form.Control.Feedback>
        </FloatingLabel>
        <Button variant="primary" type="submit">
          {id ? 'Actualizar' : 'Crear'}
        </Button>
      </Form>
    </Container>
  )
}
