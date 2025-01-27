/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { Container, Form, Button, FloatingLabel } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct, updateProduct } from '../redux/productsSlice'
import { useParams } from 'react-router-dom'
import ProductService from '../models/ProductService'
import GoMainListButton from './GoMainListButton'
import Navigation from '../helpers/Navigation'
import { toast } from 'react-toastify'

export default function ProductForm() {
  const repository = new ProductService()
  const nav = new Navigation()

  const dispatch = useDispatch()

  const { id } = useParams()

  const product = useSelector((state) => state.products.list.find((p) => p.id === id))
  const [imagePreview, setImagePreview] = useState(product?.imageBase64 || '')
  const [updatedImage, setUpdatedImage] = useState(false)

  const [validated, setValidated] = useState(false)

  useEffect(() => {
    if (product?.image) {
      window.api.getImage(product.image).then((base64data) => {
        setImagePreview(base64data)
        setUpdatedImage(false)
      })
    }
  }, [product])

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
        imageBase64: imagePreview,
        updatedImage: updatedImage
      }

      if (id) {
        // Update product
        const result = await repository.update(formProduct).catch(() => {
          toast.error(`Error al actualizar el producto`, { toastId: 'update-product' })
        })
        if (result) {
          dispatch(updateProduct(result))
          toast.success(`Producto actualizado: "${formProduct.name}"`, {
            toastId: 'update-product'
          })
        }
      } else {
        // Create product
        const result = await repository.create(formProduct)
        if (result) {
          dispatch(addProduct(result))
          toast.success(`Producto creado: "${formProduct.name}"`, { toastId: 'create-product' })
        }
      }

      form.reset()
      setValidated(false)
      form.formProductName.focus()
      nav.mainList()
    }
  }

  const handleChooseImage = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await window.api.chooseImageFile().then((base64data) => {
      setImagePreview(base64data)
      setUpdatedImage(true)
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
                setUpdatedImage(true)
              }}
            >
              Eliminar imagen
            </Button>
            <img
              alt="product image preview"
              src={`data:image/webp;base64,${imagePreview}`}
              className="img-fluid img-thumbnail w-50"
            />
          </>
        ) : null}
        <Button variant="primary" type="submit">
          {id ? 'Guardar cambios' : 'Crear'}
        </Button>
      </Form>
    </Container>
  )
}
