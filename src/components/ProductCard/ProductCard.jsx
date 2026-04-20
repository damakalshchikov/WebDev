import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import Slider from '../Slider/Slider'
import styles from './ProductCard.module.css'

export default function ProductCard({ id, image, images = [], name, price, description }) {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const allImages = [image, ...images].filter(Boolean)

  function handleAddToCart(e) {
    e.preventDefault()
    addToCart({ id, name, price, image: images[0] || image })
  }

  return (
    <div className={styles.card}>
      <Link to={`/catalog/${id}`} className={styles.cardLink}>
        <div className={styles.imageWrap}>
          <Slider images={allImages} alt={name} />
        </div>
        <div className={styles.body}>
          <div className={styles.name}>{name}</div>
          <div className={styles.price}>{price.toLocaleString('ru-RU')} ₽</div>
          <div className={styles.desc}>{description}</div>
        </div>
      </Link>
      {user?.role === 'user' && (
        <button className={styles.cartBtn} onClick={handleAddToCart}>В корзину</button>
      )}
    </div>
  )
}
