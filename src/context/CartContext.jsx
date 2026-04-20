import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('diamand_cart')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('diamand_cart', JSON.stringify(cart))
  }, [cart])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }]
    })
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  function updateQuantity(id, qty) {
    const quantity = Math.max(1, parseInt(qty) || 1)
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item))
  }

  function clearCart() {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
