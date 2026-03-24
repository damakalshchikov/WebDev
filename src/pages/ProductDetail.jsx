import { useParams, Link } from 'react-router-dom'
import { getProductById } from '../data/products'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()
  const product = getProductById(id)

  if (!product) {
    return (
      <div className={styles.notFound}>
        <p>Товар не найден.</p>
        <Link to="/catalog" className={styles.back}>← Вернуться в каталог</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Link to="/catalog" className={styles.back}>← Каталог</Link>
      <div className={styles.layout}>
        <div className={styles.imageWrap}>
          <img src={product.image} alt={product.name} className={styles.image} />
        </div>
        <div className={styles.info}>
          <span className={`${styles.badge} ${styles[product.category]}`}>
            {product.categoryLabel}
          </span>
          <h1 className={styles.name}>{product.name}</h1>
          <div className={styles.price}>{product.price.toLocaleString('ru-RU')} ₽</div>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Материал</h2>
            <p>{product.material}</p>
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Уход за украшением</h2>
            <p>{product.care}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
