// hooks
import { useEffect } from 'react'

import './assets/main.css'

import ProductService from './models/ProductService'

// components
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import AppHeader from './components/AppHeader'
import MainList from './components/MainList'
import ProductForm from './components/ProductForm'
import ProductDetail from './components/ProductDetail'
import { useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const service = new ProductService()
  const loadingState = useSelector((state) => state.app.loading)

  // first time load
  useEffect(() => {
    const init = async () => {
      // get products from  storage
      await service.getProducts()
    }

    init()
  }, [])

  return (
    <Container fluid className="d-flex flex-column p-0 vw-100 vh-100">
      <AppHeader />
      <Container fluid className="d-flex flex-grow-1 overflow-auto">
        {loadingState.status && (
          <Container
            fluid
            className="loader position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          >
            <LoadingSpinner />
          </Container>
        )}
        <HashRouter>
          <Routes>
            <Route path="/" element={<MainList />} />
            <Route path="/detail/:id" element={<ProductDetail />} />
            <Route path="/edit/:id" element={<ProductForm />} />
            <Route path="/create" element={<ProductForm />} />
          </Routes>
        </HashRouter>
      </Container>
      <ToastContainer position="bottom-right" autoClose="2000" />
    </Container>
  )
}

export default App
