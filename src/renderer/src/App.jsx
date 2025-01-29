// hooks
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setProducts } from './redux/productsSlice'

import './assets/main.css'

import ProductService from './models/ProductService'

// components
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import AppHeader from './components/AppHeader'
import MainList from './components/MainList'
import ProductForm from './components/ProductForm'
import ProductDetail from './components/ProductDetail'
import Loading from './helpers/Loading'
import { setLoading } from './redux/appSlice'
import { useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const dispatch = useDispatch()
  const repository = new ProductService()
  const loadingMsg = new Loading(dispatch, setLoading)
  const loadingState = useSelector((state) => state.app.loading)

  // first time load
  useEffect(() => {
    const init = async () => {
      // get products from persistent storage
      loadingMsg.showLoadingMsg()
      await repository
        .get()
        .then((result) => {
          // update redux store
          dispatch(setProducts(result))
        })
        .finally(() => {
          loadingMsg.hideLoadingMsg()
        })
    }

    init()
  }, [])

  return (
    <Container fluid className="d-flex flex-column p-0 vw-100 vh-100">
      <AppHeader />
      <Container fluid className="d-flex flex-grow-1 overflow-auto">
        {loadingState.status ? (
          <Container fluid className="d-flex justify-content-center align-items-center">
            <LoadingSpinner />
          </Container>
        ) : (
          <HashRouter>
            <Routes>
              <Route path="/" element={<MainList />} />
              <Route path="/create" element={<ProductForm />} />
              <Route path="/detail/:id" element={<ProductDetail />} />
              <Route path="/edit/:id" element={<ProductForm />} />
            </Routes>
          </HashRouter>
        )}
      </Container>
      <ToastContainer position="bottom-right" autoClose="2000" />
    </Container>
  )
}

export default App
