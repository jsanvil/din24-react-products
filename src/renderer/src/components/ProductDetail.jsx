import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import GoMainListButton from './GoMainListButton'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Navigation from '../helpers/Navigation'

export default function ProductDetail() {
  const { id } = useParams()
  const product = useSelector((state) => state.products.list.find((p) => p.id === id))
  const [imageBase64, setImageBase64] = useState('')
  const nav = new Navigation()

  useEffect(() => {
    if (!product) {
      nav.mainList()
    }

    const getBase64Image = async () => {
      // await window.api
      //   .getImage(product.image)
      //   .then((base64data) => {
      //     setImageBase64(base64data)
      //   })
      //   .catch(() => {
      //     toast.error(`Error al obtener la imagen`, { toastId: 'get-image' })
      //   })
    }

    if (product?.image) {
      getBase64Image()
    }

    return () => {
      setImageBase64('')
    }
  }, [product])

  return (
    <Container>
      <GoMainListButton />
      <h1 className="text-truncate">{product?.name}</h1>
      <p>Nombre: {product?.name}</p>
      <p>Precio: {product?.price}</p>
      <p>Cantidad: {product?.stock}</p>
      <p>Descripción: {product?.description}</p>
      <p>Disponible: {product?.availableTimestamp}</p>
      {imageBase64 && <img src={`data:image/webp;base64,${imageBase64}`} alt={product?.name} />}
    </Container>
  )
}
