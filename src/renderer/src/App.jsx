import { HashRouter, Route, Routes } from 'react-router-dom'

import './assets/main.css'

import MainList from './components/MainList'
import ProductForm from './components/ProductForm'
import ProductDetail from './components/ProductDetail'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainList />} />
        <Route path="/create" element={<ProductForm />} />
        <Route path="/detail/:id" element={<ProductDetail />} />
        <Route path="/edit/:id" element={<ProductForm />} />
      </Routes>
    </HashRouter>
  )
}

export default App
