/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts, addProducts } from '../redux/productsSlice'
import ProductService from '../models/ProductService'
import ProductListItem from './ProductListItem'
import { Button } from 'react-bootstrap'

export default function ProductList() {
  const productList = useSelector((state) => state.products.list)
  const repository = new ProductService()
  const dispatch = useDispatch()

  const loadMore = async () => {
    const from = productList.length
    const size = 2
    await repository.get(from, size).then((result) => {
      dispatch(addProducts(result))
    })
  }

  useEffect(() => {
    const init = async () => {
      await repository.get().then((result) => {
        dispatch(setProducts(result))
      })
    }

    init()
  }, [])

  return (
    <>
      {productList.map((product) => (
        <ProductListItem key={product.id} productId={product.id} />
      ))}
      <Button type="button" onClick={loadMore}>
        Cargar más
      </Button>
    </>
  )
}
