/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '../redux/productsSlice'
import ProductService from '../models/ProductService'
import ProductListItem from './ProductListItem'

export default function ProductList() {
  const productList = useSelector((state) => state.products.list)
  const repository = new ProductService()
  const dispatch = useDispatch()

  useEffect(() => {
    const init = async () => {
      await repository.getAll().then((result) => {
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
    </>
  )
}
