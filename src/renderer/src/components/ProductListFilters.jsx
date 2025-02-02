import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form } from 'react-bootstrap'
import Slider from '@mui/material/Slider'
import { filterPriceRange, filterSearch, sortByField } from '../redux/productsSlice'

export default function ProductListFilters() {
  const PRICE_RANGE_MIN = 0
  const PRICE_RANGE_MAX = 1000
  const PRICE_RANGE_STEP = 100

  // filters: {
  //   search: '',
  //   sort: {
  //     field: '',
  //     order: 'asc'
  //   },
  //   priceRange: {
  //     min: 0,
  //     max: 1000
  //   }
  // }
  const dispatch = useDispatch()
  const { search } = useSelector((state) => state.products.filters)
  const sort = useSelector((state) => state.products.filters)
  const { min: priceMin, max: priceMax } = useSelector((state) => state.products.filters.priceRange)
  const [priceRangeLabel, setPriceRangeLabel] = useState('')

  useEffect(() => {
    console.log('useEffect priceRange', priceMin, priceMax)
    priceMin
    priceMax
    const hasMin = priceMin > PRICE_RANGE_MIN
    const hasMax = priceMax < PRICE_RANGE_MAX

    console.log('min', priceMin, 'max', priceMax)

    let label = ''

    if (hasMin && hasMax) {
      label = `entre ${priceMin} y ${priceMax}`
    } else if (hasMin) {
      label = `más de ${priceMin}`
    } else if (hasMax) {
      label = `menos de ${priceMax}`
    }

    if (label.length > 0) {
      label += ' €'
    }

    setPriceRangeLabel(label)
  }, [priceMin, priceMax])

  const handleFilterPrice = (e) => {
    const [min, max] = e.target.value
    dispatch(filterPriceRange([min, max]))
  }

  const handleSort = (e) => {}

  return (
    <div className="p-3">
      <h3>Filtros</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Select onChange={handleSort}>
            <option value="">Ordenar...</option>
            <option value="sortPriceAsc">Precio ascendente</option>
            <option value="sortPriceDes">Precio descendente</option>
            <option value="sortNameAsc">Nombre ascendente</option>
            <option value="sortNameDes">Nombre descendente</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>
            {'Precio: '}
            <label className="fst-italic small text-end" display={priceRangeLabel.length > 0}>
              {priceRangeLabel}
            </label>
          </Form.Label>
          <Slider
            onChange={handleFilterPrice}
            ariaLabel="steps slider"
            marks
            valueLabelDisplay="auto"
            step={PRICE_RANGE_STEP}
            min={PRICE_RANGE_MIN}
            max={PRICE_RANGE_MAX}
            value={[priceMin, priceMax]}
            defaultValue={[PRICE_RANGE_MIN, PRICE_RANGE_MAX]}
          />
        </Form.Group>
      </Form>
    </div>
  )
}
