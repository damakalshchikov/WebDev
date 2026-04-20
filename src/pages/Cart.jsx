import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import styles from './Cart.module.css'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const { user } = useAuth()
  const [ordering, setOrdering] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)

  async function handleOrder() {
    setError('')
    setOrdering(true)
    try {
      const lines = cart.map(item =>
        `- ${item.name} × ${item.quantity} = ${(Number(item.price) * item.quantity).toLocaleString('ru-RU')} ₽`
      ).join('\n')
      const body = `${lines}\n\nИтого: ${total.toLocaleString('ru-RU')} ₽`

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ subject: 'Заказ из корзины', body }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Ошибка оформления заказа')
      }
      clearCart()
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setOrdering(false)
    }
  }

  if (success) {
    return (
      <div className={styles.wrap}>
        <div className={styles.successBox}>
          <div className={styles.successIcon}>✓</div>
          <h2>Заказ оформлен!</h2>
          <p>Администратор свяжется с вами для подтверждения.</p>
          <Link to="/catalog" className={styles.backLink}>Продолжить покупки</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Корзина</h1>

      {cart.length === 0 ? (
        <div className={styles.empty}>
          <p>Корзина пуста.</p>
          <Link to="/catalog" className={styles.backLink}>Перейти в каталог</Link>
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {cart.map(item => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemImage}>
                  {item.image
                    ? <img src={item.image} alt={item.name} />
                    : <div className={styles.noImg}>—</div>
                  }
                </div>
                <div className={styles.itemInfo}>
                  <Link to={`/catalog/${item.id}`} className={styles.itemName}>{item.name}</Link>
                  <div className={styles.itemPrice}>{Number(item.price).toLocaleString('ru-RU')} ₽ / шт.</div>
                </div>
                <div className={styles.qtyControl}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className={styles.qtyBtn}>−</button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => updateQuantity(item.id, e.target.value)}
                    className={styles.qtyInput}
                  />
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className={styles.qtyBtn}>+</button>
                </div>
                <div className={styles.itemTotal}>
                  {(Number(item.price) * item.quantity).toLocaleString('ru-RU')} ₽
                </div>
                <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn}>✕</button>
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <div className={styles.total}>Итого: <strong>{total.toLocaleString('ru-RU')} ₽</strong></div>
            {error && <div className={styles.error}>{error}</div>}
            {user?.role === 'user' ? (
              <button className={styles.orderBtn} onClick={handleOrder} disabled={ordering}>
                {ordering ? 'Оформление...' : 'Оформить заказ'}
              </button>
            ) : !user ? (
              <p className={styles.hint}><Link to="/register">Зарегистрируйтесь</Link> или войдите, чтобы оформить заказ.</p>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}
