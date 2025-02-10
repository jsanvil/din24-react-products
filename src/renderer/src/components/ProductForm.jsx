/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Container, Form, Button, FloatingLabel } from 'react-bootstrap'
import ProductService from '../models/ProductService'
import GoMainListButton from './GoMainListButton'
import Navigation from '../helpers/Navigation'

export default function ProductForm() {
  const service = new ProductService()
  const nav = new Navigation()

  const { id } = useParams()

  const product = useSelector((state) => state.products.list.find((p) => p.id === id))

  const [imagePreview, setImagePreview] = useState(product?.image || '')

  const [validated, setValidated] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(product?.image?.startsWith('data:image') || false)

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
        stock: form.formProductStock.value,
        description: form.formProductDescription.value,
        availableTimestamp: form.formProductAvailableTimestamp.value,
        image: imagePreview
      }

      let result

      if (id) {
        console.log('form update')
        result = await service.update(formProduct)
      } else {
        console.log('form create')
        result = await service.create(formProduct)
        form.reset()
      }

      if (result?.id) {
        nav.productDetail(result.id)
      }
    }
  }

  const handleChooseImage = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await window.api.chooseImageFile().then((base64data) => {
      setImagePreview(`data:image/png;base64,${base64data}`)
      setImageLoaded(true)
    })
  }

  return (
    <Container>
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
        <FloatingLabel controlId="formProductName" label="Nombre">
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
            step={0.01}
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
            step={1}
            defaultValue={product?.stock}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a product stock.
          </Form.Control.Feedback>
        </FloatingLabel>
        <FloatingLabel controlId="formProductDescription" label="Descripción">
          <Form.Control
            as="textarea"
            placeholder=""
            rows={3}
            defaultValue={product?.description}
            style={{ height: '100px' }}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a product stock.
          </Form.Control.Feedback>
        </FloatingLabel>
        <FloatingLabel controlId="formProductAvailableTimestamp" label="Disponibilidad">
          <Form.Control
            type="datetime-local"
            placeholder=""
            defaultValue={product?.availableTimestamp}
          />
        </FloatingLabel>
        <Button className="align-self-start" onClick={handleChooseImage}>
          Seleccionar imagen
        </Button>
        {imagePreview ? (
          <>
            <Button
              className="align-self-start"
              variant="danger"
              onClick={() => {
                setImagePreview('')
              }}
            >
              Eliminar imagen
            </Button>
            {imageLoaded && (
              <img
                alt="product image preview"
                src={imagePreview ? imagePreview : product?.image}
                className="img-fluid img-thumbnail w-50"
                onLoad={() => setImageLoaded(true)}
              />
            )}
          </>
        ) : null}
        <Button variant="primary" type="submit">
          {id ? 'Guardar cambios' : 'Crear'}
        </Button>
      </Form>
    </Container>
  )
}
