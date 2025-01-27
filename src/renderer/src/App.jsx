import { HashRouter, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setProducts } from './redux/productsSlice'
import ProductService from './models/ProductService'

import './assets/main.css'

import AppHeader from './components/AppHeader'
import MainList from './components/MainList'
import ProductForm from './components/ProductForm'
import ProductDetail from './components/ProductDetail'
import { ToastContainer } from 'react-toastify'

function App() {
  const dispatch = useDispatch()
  const repository = new ProductService()

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
      <AppHeader />
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainList />} />
          <Route path="/create" element={<ProductForm />} />
          <Route path="/detail/:id" element={<ProductDetail />} />
          <Route path="/edit/:id" element={<ProductForm />} />
        </Routes>
      </HashRouter>
      <ToastContainer position="bottom-right" autoClose="2000" />
    </>
  )
}

export default App
