import { Link } from 'react-router-dom'
import styles from './ProductCard.module.css'

export default function ProductCard({ id, image, name, price, description }) {
  return (
    <Link to={`/catalog/${id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imageWrap}>
          <img src={image} alt={name} className={styles.image} />
        </div>
        <div className={styles.body}>
          <div className={styles.name}>{name}</div>
          <div className={styles.price}>{price.toLocaleString('ru-RU')} ₽</div>
          <div className={styles.desc}>{description}</div>
        </div>
      </div>
    </Link>
  )
}
