import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import GoMainListButton from './GoMainListButton'
import { useEffect, useState } from 'react'
import Navigation from '../helpers/Navigation'
import { useTranslation } from 'react-i18next'

export default function ProductDetail() {
  const { id } = useParams()
  const nav = new Navigation()
  const { t } = useTranslation()

  const product = useSelector((state) => state.products.list.find((p) => p.id === id))
  const [imageLoaded, setImageLoaded] = useState(product?.image?.startsWith('data:image'))

  useEffect(() => {
    console.log(product)
    if (!product) {
      nav.mainList()
    }
  }, [product])

  return (
    <Container>
      <GoMainListButton />
      <h1 className="text-truncate">{product?.name}</h1>
      <p>
        {t('productDetail.name')}: {product?.name}
      </p>
      <p>
        {t('productDetail.price')}: {product?.price}
      </p>
      <p>
        {t('productDetail.stock')}: {product?.stock}
      </p>
      <p>
        {t('productDetail.description')}: {product?.description}
      </p>
      <p>
        {t('productDetail.available')}: {product?.availableTimestamp}
      </p>
      {imageLoaded && (
        <img src={product?.image} alt={product?.name} onLoad={() => setImageLoaded(true)} />
      )}
    </Container>
  )
}
