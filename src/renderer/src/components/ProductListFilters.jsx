import { useState } from 'react'
import { Form } from 'react-bootstrap'

export default function ProductListFilters() {
  const [price, setPrice] = useState(1000)

  const handleFilterPrice = (e) => {
    setPrice(e.target.value)
  }

  return (
    <div className="p-3">
      <h3>Filtros</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" placeholder="Nombre del producto" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Preció máximo {price} €</Form.Label>
          <Form.Range
            min="0"
            max="1000"
            step="100"
            onChange={handleFilterPrice}
            defaultValue={price}
          />
        </Form.Group>
      </Form>
    </div>
  )
}
