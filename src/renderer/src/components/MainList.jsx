import { Button, Container } from 'react-bootstrap'
import ProductList from './ProductList'
import Navigation from '../helpers/Navigation'
import ProductListFilters from './ProductListFilters'
import ProductListSearch from './ProductListSearch'

import { useTranslation } from 'react-i18next'

export default function MainList() {
  const nav = new Navigation()
  const { t } = useTranslation()

  return (
    <Container fluid className="my-3 d-flex flex-row">
      <ProductListFilters className="flex-shrink-1" />
      <Container className="flex-grow-1">
        <Container className="p-0 d-flex flex-row gap-2">
          <ProductListSearch />
          <div className="flex-grow-1"></div>
          <Button
            className="flex-shrink-1"
            variant="outline-primary"
            onClick={() => nav.newProduct()}
          >
            <i className="bi bi-plus"></i> {t('mainView.newProductBtn')}
          </Button>
        </Container>
        <ProductList />
      </Container>
    </Container>
  )
}
