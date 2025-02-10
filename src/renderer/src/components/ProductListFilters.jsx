import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Form } from 'react-bootstrap'
import Slider from '@mui/material/Slider'
import {
  filterPriceRange,
  sortByField,
  filterDateRange,
  filterMinStock
} from '../redux/productsSlice'
import ProductService from '../models/ProductService'

export default function ProductListFilters() {
  const PRICE_RANGE_MIN = 0
  const PRICE_RANGE_MAX = 1000
  const PRICE_RANGE_STEP = 100
  const STOCK_MIN = 0

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const service = new ProductService()

  const { sort } = useSelector((state) => state.products.filters)
  const { min: priceMin, max: priceMax } = useSelector((state) => state.products.filters.priceRange)
  const { min: minDate, max: maxDate } = useSelector((state) => state.products.filters.date)
  const { minStock } = useSelector((state) => state.products.filters)

  const [priceRangeLabel, setPriceRangeLabel] = useState('')
  const [appliedFilters, setAppliedFilters] = useState({})
  const [filtersChanged, setFiltersChanged] = useState(false)

  useEffect(() => {
    setAppliedFilters({
      sort: { field: sort.field, order: sort.order },
      priceRange: { min: priceMin, max: priceMax },
      minStock,
      date: { min: minDate, max: maxDate }
    })
  }, [])

  useEffect(() => {
    setFiltersChanged(
      appliedFilters?.sort?.field !== sort.field ||
        appliedFilters?.sort?.order !== sort.order ||
        appliedFilters?.priceRange.min !== priceMin ||
        appliedFilters?.priceRange.max !== priceMax ||
        appliedFilters?.minStock !== minStock ||
        appliedFilters?.date.min !== minDate ||
        appliedFilters?.date.max !== maxDate
    )
  }, [appliedFilters, sort, priceMin, priceMax, minStock, minDate, maxDate])

  useEffect(() => {
    const hasMin = priceMin > PRICE_RANGE_MIN
    const hasMax = priceMax < PRICE_RANGE_MAX

    let label = ''

    if (hasMin && hasMax) {
      label = `${t('filtersView.priceBetweenMin')} ${priceMin} ${t('filtersView.priceBetweenAndMax')} ${priceMax}`
    } else if (hasMin) {
      label = `${t('filtersView.priceGreaterThan')} ${priceMin}`
    } else if (hasMax) {
      label = `${t('filtersView.priceLessThan')} ${priceMax}`
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

  const handleSort = async (e) => {
    e.preventDefault()
    const [field, order] = e.target.value.split(',')
    dispatch(sortByField({ field, order }))
  }

  const handleFilterDate = ([min, max]) => {
    dispatch(filterDateRange({ min, max }))
  }

  const resetPriceRange = () => {
    dispatch(filterPriceRange([PRICE_RANGE_MIN, PRICE_RANGE_MAX]))
  }

  const resetDateRange = () => {
    dispatch(filterDateRange({ min: '', max: '' }))
  }

  const resetMinStock = () => {
    dispatch(filterMinStock(0))
  }

  const resetSort = () => {
    dispatch(sortByField({ field: '', order: 'asc' }))
  }

  const resetFilters = () => {
    dispatch(filterPriceRange([PRICE_RANGE_MIN, PRICE_RANGE_MAX]))
    dispatch(sortByField({ field: '', order: 'asc' }))
    dispatch(filterMinStock(0))
    dispatch(filterDateRange({ min: '', max: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await service.getProducts()
    setAppliedFilters({
      sort: { field: sort.field, order: sort.order },
      priceRange: { min: priceMin, max: priceMax },
      minStock,
      date: { min: minDate, max: maxDate }
    })
  }

  return (
    <div className="p-3">
      <h3>Filtros</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          {/* ----- SORT BY ----- */}
          <Form.Label className="p-0 m-0">Ordenar</Form.Label>{' '}
          {sort.field && (
            <Button variant="link text-danger" className="p-0 m-0" onClick={resetSort}>
              <i className="bi bi-x-circle"></i>
            </Button>
          )}
          <Form.Select onChange={handleSort} value={`${sort.field},${sort.order}`}>
            <option value="">Ordenar...</option>
            <option value="price,asc">Baratos primero</option>
            <option value="price,desc">Más caros primero</option>
            <option value="name,asc">A-Z</option>
            <option value="name,desc">Z-A</option>
          </Form.Select>
        </Form.Group>
        {/* ----- PRICE RANGE ----- */}
        <Form.Group className="mb-0">
          <Form.Label className="p-0 m-0">
            Precio{' '}
            {(priceMin > PRICE_RANGE_MIN || priceMax < PRICE_RANGE_MAX) && (
              <Button
                variant="link text-danger"
                className="p-0 m-0"
                title="Restablecer"
                onClick={resetPriceRange}
              >
                <i className="bi bi-x-circle"></i>
              </Button>
            )}
          </Form.Label>
          <Slider
            className="p-0 m-0"
            onChange={handleFilterPrice}
            defaultValue={[PRICE_RANGE_MIN, PRICE_RANGE_MAX]}
            min={PRICE_RANGE_MIN}
            max={PRICE_RANGE_MAX}
            step={PRICE_RANGE_STEP}
            value={[priceMin, priceMax]}
            getAriaValueText={(value) => `${value} €`}
            valueLabelDisplay="auto"
          />
          <Form.Text className="fst-italic fw-light p-0 m-0 small text-end d-block">
            &nbsp;
            {priceRangeLabel}
          </Form.Text>
        </Form.Group>
        {/* ----- MIN STOCK ----- */}
        <Form.Group className="mb-3">
          <Form.Label className="p-0 m-0">Stock mínimo</Form.Label>{' '}
          {minStock > 0 && (
            <Button
              variant="link text-danger"
              className="p-0 m-0"
              title="Restablecer"
              onClick={resetMinStock}
            >
              <i className="bi bi-x-circle"></i>
            </Button>
          )}
          <Form.Control
            type="number"
            value={minStock}
            min={STOCK_MIN}
            onChange={(e) => dispatch(filterMinStock(e.target.value))}
          />
        </Form.Group>
        {/* ----- DATE RANGE ----- */}
        <Form.Group className="mb-3">
          <Form.Label className="p-0 m-0">Disponibilidad</Form.Label>
          {'  '}
          {minDate || maxDate ? (
            <Button
              variant="link text-danger"
              className="p-0 m-0"
              title="Restablecer"
              onClick={resetDateRange}
            >
              <i className="bi bi-x-circle"></i>
            </Button>
          ) : (
            ''
          )}
          <Form.Control
            type="date"
            title="desde"
            value={minDate}
            max={maxDate ?? ''}
            onInput={(e) => handleFilterDate([e.target.value, maxDate])}
          />
          <Form.Control
            type="date"
            title="hasta"
            value={maxDate}
            min={minDate ?? ''}
            onInput={(e) => handleFilterDate([minDate, e.target.value])}
          />
        </Form.Group>
        {/* ----- APPLY / RESET BUTTONS ----- */}
        <Form.Group className="mb-3">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => service.getProducts()}
            disabled={!filtersChanged}
          >
            Aplicar
          </button>
          {(sort.field ||
            priceMin > PRICE_RANGE_MIN ||
            priceMax < PRICE_RANGE_MAX ||
            minStock > 0 ||
            minDate ||
            maxDate) && (
            <button
              type="reset"
              className="btn btn-secondary ms-2"
              onClick={() => dispatch(resetFilters())}
            >
              Limpiar
            </button>
          )}
        </Form.Group>
      </Form>
    </div>
  )
}
