import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Catalog from './pages/Catalog'
import Contacts from './pages/Contacts'
import Register from './pages/Register'
import ProductDetail from './pages/ProductDetail'
import Reviews from './pages/Reviews'
import Profile from './pages/Profile'
import GiftCards from './pages/GiftCards'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:id" element={<ProductDetail />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/gift-cards" element={<GiftCards />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}
