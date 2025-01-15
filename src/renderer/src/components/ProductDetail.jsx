import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import GoMainListButton from './GoMainListButton'

export default function ProductDetail() {
  const { id } = useParams()
  const product = useSelector((state) => state.products.list.find((p) => p.id === id))

  return (
    <Container>
      <h1 className="text-truncate">{product?.name}</h1>
      <GoMainListButton />
      <p>Nombre: {product?.name}</p>
      <p>Precio: {product?.price}</p>
      <p>Cantidad: {product?.stock}</p>
    </Container>
  )
}
